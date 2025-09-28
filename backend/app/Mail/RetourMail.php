<?php

namespace App\Mail;

use App\Models\Location;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Attachment;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class RetourMail extends Mailable
{
    use Queueable, SerializesModels;

    public $reservation;
    public $path;


    /**
     * Create a new message instance.
     */
    public function __construct($reservation, $path)
    {
        $this->reservation = $reservation;
        $this->path = $path;
    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Retour Mail',

        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            view: 'emails.retour',
            with: [
                'reservation' => $this->reservation,
                'vehicule' => $this->reservation->voiture,
                'client' => $this->reservation->client,
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [
            Attachment::fromStorageDisk('public', $this->path),
        ];
    }
}
