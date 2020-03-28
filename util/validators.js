module.exports.validateRegisterInput = (
    username,
    email,
    password,
    confirmPassword
) => {
    const errors = {};
    if (username.trim() === ''){
        errors.username = 'Nome de usuário não pode estar vazio';
    }
    if (email.trim() === ''){
        errors.email = 'Email não pode estar vazio';
    } else {
        const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
        if(!email.match(regEx)){
            errors.email = 'Email não é válido';
        }
    }
    if (password.trim() === ''){
        errors.password = 'Senha não pode estar vazia';
    } else if (password!==confirmPassword){
        errors.confirmPassword = 'Senhas não correspondem';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}

module.exports.validateLoginInput = (username, password) => {
    const errors = {};
    if (username.trim() === ''){
        errors.username = 'Nome de usuário não pode estar vazio';
    }
    if (password.trim() === ''){
        errors.password = 'Senha não pode estar vazio';
    }

    return {
        errors,
        valid: Object.keys(errors).length < 1
    }
}