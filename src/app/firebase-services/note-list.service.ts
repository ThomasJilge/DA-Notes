import { Injectable, inject } from '@angular/core';
import { Firestore, collection, doc, collectionData, onSnapshot, addDoc, updateDoc, deleteDoc, query, limit, orderBy, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Note } from '../interfaces/note.interface';

@Injectable({
  providedIn: 'root'
})
export class NoteListService {

  trashNotes: Note[] = [];
  normalNotes: Note[] = [];
  normalMarkedNotes: Note[] = [];
  items$;
  items;
  unsubTrash;
  unsubNotes;
  unsubMarkedNotes;
  firestore: Firestore = inject(Firestore);

  constructor() {
    this.items$ = collectionData(this.getNotesRef());

    this.unsubNotes = this.subNotesList();
    this.unsubMarkedNotes = this.subMarkedNotesList();
    this.unsubTrash = this.subTrashList();
    

    this.unsubNotes = onSnapshot(this.getSingleDocRef("notes", "adf4564547shdhd"), (element) => {
    });

    this.items$ = collectionData(this.getNotesRef());
    this.items = this.items$.subscribe( (list) => {
      list.forEach(element => {
        console.log(element);
      })
    })
    this.items.unsubscribe();
  }

  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) =>{ console.log(err) }
    );
  }

  // async deleteNote(colId:string, docId:string) {
  //   await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
  //     (err) => { console.log(err); }
  //   );
  // }

  async updateNote(note: Note) {
    if(note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id)
      await updateDoc(docRef, this.getCleanJson(note)).catch(
        (err) => { console.log(err); }
      );
    }
  }

  getCleanJson(note: Note):{} {
    return {
      type: note.type,
    title: note.title,
    content: note.content,
    marked: note.marked,
    }
  }
  
  getColIdFromNote(note:Note) {
    if(note.type == 'note') {
      return 'notes';
    } else {
      return 'trash';
    }
  }

  // async addNote(item: Note, colId: "notes" | "trash") {
  //   await addDoc(this.getNotesRef(), item).catch((err) => { console.error(err) }
  //   ).then((docRef) => {console.log("Document written  with ID:", docRef?.id);}
  //   ) 
  // }

  async addNote(item: Note, colId: "notes" | "trash") {
    const collectionRef = collection(this.firestore, colId);
    await addDoc(collectionRef, item)
    .catch((err) => { console.error(err) })
    .then((docRef) => { console.log(docRef); });
}


  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
    this.unsubMarkedNotes();
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach(element => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  subNotesList() {
    const q = query(this.getNotesRef(), limit(100));
    return onSnapshot(q, (list) => {
      this.normalNotes = [];
      list.forEach(element => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subMarkedNotesList() {
    const q = query(this.getNotesRef(), where("marked", "==", true), limit(100));
    return onSnapshot(q, (list) => {
      this.normalMarkedNotes = [];
      list.forEach(element => {
        this.normalMarkedNotes.push(this.setNoteObject(element.data(), element.id));
      })
    });
  }

  setNoteObject(obj: any, id: string): Note {
    return {
      id: id,
      type: obj.type || "note",
      title: obj.title || "", 
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  // const itemCollection = collection(this.firestore, 'items');

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId:string, docId:string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
