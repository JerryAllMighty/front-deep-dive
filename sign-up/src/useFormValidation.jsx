import { useState, useRef, useEffect } from 'react'

export function useFormValidation(form) {
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);


    const [isNameInputValid, setIsNameInputValid] = useState(true);
    const [isEmailInputValid, setIsEmailInputValid] = useState(true);
    const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);

    useEffect(() => {
        nameInputRef.current.focus();
    }, []);

    function validateInput(e) {
        console.log('validation');
        e.preventDefault;
        const name = nameInputRef.current.value;
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;

        if (name.trim() === '') {
            setIsNameInputValid(false);
            nameInputRef.current.focus();
            return;
        }

        if (!email.contains('@')) {
            setIsEmailInputValid(false);
            emailInputRef.current.focus();
            return;
        }

        if (password.length() < 8) {
            setIsPasswordInputValid(false);
            passwordInputRef.current.focus();
            return;
        }
    };

    return {
        nameInputRef, emailInputRef, passwordInputRef,
        isNameInputValid, isEmailInputValid, isPasswordInputValid, validateInput
    };
}
