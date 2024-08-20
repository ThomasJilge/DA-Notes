import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"danotes-97cd3","appId":"1:36999308651:web:9ae894fb2c3e1ca3ed982e","storageBucket":"danotes-97cd3.appspot.com","apiKey":"AIzaSyB_0AzwrKMIZVoTCGUUi_J4wX4nMixZShA","authDomain":"danotes-97cd3.firebaseapp.com","messagingSenderId":"36999308651"})), provideFirestore(() => getFirestore())]
};
