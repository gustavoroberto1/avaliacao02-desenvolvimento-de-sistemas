'use client'

import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./styles.module.css";


export default function Login() {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const disabledButton = (!email || !(password.length > 0));

    const router = useRouter();

    async function handleSubmit() {
        try{
            const response = await axios.post<{ access_token: string }>("http://localhost:3333/login", {
                email, password
            })

            localStorage.setItem('access_token', response.data.access_token)
            router.push('/home')
        } catch {
            alert("Erro ao fazer login")
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.form}>
                <h2>Login</h2>
                <input
                    type="text"
                    placeholder="E-mail"
                    className={styles.input}
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className={styles.input}
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />

                <button
                    className={styles.button}
                    onClick={handleSubmit}
                    disabled={disabledButton}
                >
                    Entrar
                </button>
            </div>
        </div>
    )
}