import { useState, useRef } from 'react'

export function useFormValidation() {
    const nameInputRef = useRef(null);
    const emailInputRef = useRef(null);
    const passwordInputRef = useRef(null);

    const [isNameInputValid, setIsNameInputValid] = useState(true);
    const [isEmailInputValid, setIsEmailInputValid] = useState(true);
    const [isPasswordInputValid, setIsPasswordInputValid] = useState(true);

    function validateInput(e) {
        e.preventDefault();
        setIsNameInputValid(true);
        setIsEmailInputValid(true);
        setIsPasswordInputValid(true);

        const name = nameInputRef.current.value;
        const email = emailInputRef.current.value;
        const password = passwordInputRef.current.value;

        if (name.trim() === '') {
            setIsNameInputValid(false);
            nameInputRef.current.focus();
            return;
        }

        // 왜 ref를 ''로 초기화하고 contains로 비교는 원할하게 안되었는지? 무조건 null로 선언하고 include 같은 함수를 사용해야하는지?
        if (!email.trim().includes('@')) {
            setIsEmailInputValid(false);
            emailInputRef.current.focus();
            return;
        }

        if (password.trim().length < 8) {
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
