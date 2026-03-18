"use client";

import { useState } from "react";

export default function ContactPage() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [feedback, setFeedback] = useState("");

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.subject || !form.message) {
            setFeedback("Merci de remplir tous les champs.");
            return;
        }

        setFeedback(
            "Votre message a bien été pris en compte.(version test)"
        );

        setForm({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    };

    return (
        <main className="p-10">
            <h1 className="mb-6 text-3xl font-bold">Contact</h1>

            <p className="mb-8 max-w-2xl text-gray-300">
                Une question sur un produit, une commande ou une disponibilité ?
                Utilisez ce formulaire pour nous contacter.
            </p>

            <form onSubmit={handleSubmit} className="grid max-w-2xl gap-4">
                <input
                    type="text"
                    name="name"
                    placeholder="Nom"
                    value={form.name}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Adresse e-mail"
                    value={form.email}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <input
                    type="text"
                    name="subject"
                    placeholder="Sujet"
                    value={form.subject}
                    onChange={handleChange}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <textarea
                    name="message"
                    placeholder="Votre message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    className="rounded border border-gray-700 bg-black px-4 py-2 text-white"
                />

                <button
                    type="submit"
                    className="w-fit rounded bg-white px-4 py-2 font-semibold text-black"
                >
                    Envoyer
                </button>
            </form>

            {feedback && (
                <p className="mt-6 rounded border border-blue-600 bg-blue-950 px-4 py-3 text-blue-300">
                    {feedback}
                </p>
            )}
        </main>
    );
}