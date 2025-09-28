import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import emailjs from 'emailjs-com';

@Component({
  standalone: true,
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
  imports: [ReactiveFormsModule]
})
export class ContactComponent {
  /**
   * FormBuilder qui permet de créer des formulaires réactifs
   * @private
   */
  fb = inject(FormBuilder);

  /**
   * snackBar qui permet d'afficher des messages de notification
   */
  snackBar = inject(MatSnackBar);

  /**
   * Formulaire de contact
   */
  form: FormGroup = this.fb.group({
    name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    message: new FormControl('', [Validators.required]),
  });

  /**
   * Methode submit qui est appelée lors de l'envoi du formulaire
   */
  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const templateParams = {
      from_name: this.form.value.name,
      reply_to: this.form.value.email,
      message: this.form.value.message
    };
    // token pour les mails
    emailjs.send(
      'service_mygbnzx',
      'template_u66rhlc',
      templateParams,
      '3r0tMxO0C7a40KE--'
    ).then(() => {
      this.snackBar.open('Votre message a été envoyé avec succès !', 'Fermer', {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
      this.form.reset();
    }).catch((error) => {
      console.error('Erreur lors de l’envoi :', error);
      this.snackBar.open('Erreur lors de l’envoi du message.', 'Fermer', {
        duration: 1000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    });
  }
}
