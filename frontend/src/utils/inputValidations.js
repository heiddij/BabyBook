/* import { useSelector } from "react-redux"

const users = useSelector(state => state.users);

const checkUsernameUnique = (username) => {
    const usernameExists = users.some(user => user.username === username);
    return usernameExists ? 'Username already taken' : true; // If username exists, return an error message
} */

export const firstname_validation = {
    name: 'firstname',
    label: 'Etunimi',
    type: 'text',
    id: 'firstname',
    placeholder: 'Kirjoita etunimi...',
    validation: {
      required: {
        value: true,
        message: 'Kirjoita etunimi',
      },
      maxLength: {
        value: 30,
        message: 'Enintään 30 kirjainta',
      },
    },
}

export const lastname_validation = {
name: 'lastname',
label: 'Sukunimi',
type: 'text',
id: 'lastname',
placeholder: 'Kirjoita sukunimi...',
validation: {
    required: {
    value: true,
    message: 'Kirjoita sukunimi',
    },
    maxLength: {
    value: 30,
    message: 'Enintään 30 kirjainta',
    },
},
}

export const birthdate_validation = {
    name: 'birthdate',
    label: 'Syntymäaika',
    type: 'date',
    id: 'birthdate',
    placeholder: 'Kirjoita syntymäaika...',
    validation: {
        required: {
        value: true,
        message: 'Kirjoita syntymäaika',
        }
    },
}

export const birthplace_validation = {
    name: 'birthplace',
    label: 'Syntymäpaikka',
    type: 'text',
    id: 'birthplace',
    placeholder: 'Kirjoita syntymäpaikka...',
    validation: {
        maxLength: {
        value: 30,
        message: 'Enintään 30 kirjainta',
        },
    },
}

export const username_validation = {
    name: 'username',
    label: 'Käyttäjänimi',
    type: 'text',
    id: 'username',
    placeholder: 'Kirjoita käyttäjänimi...',
    validation: {
        required: {
        value: true,
        message: 'Kirjoita käyttäjänimi',
        },
        //checkUsernameUnique
    },
}
  
  export const desc_validation = {
    name: 'description',
    label: 'description',
    multiline: true,
    id: 'description',
    placeholder: 'write description ...',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      maxLength: {
        value: 200,
        message: '200 characters max',
      },
    },
  }
  
  export const password_validation = {
    name: 'password',
    label: 'Salasana',
    type: 'password',
    id: 'password',
    placeholder: 'Kirjoita salasana...',
    /*
    validation: {
      required: {
        value: true,
        message: 'Kirjoita salasana',
      },
      minLength: {
        value: 6,
        message: 'Vähintään 6 kirjainta',
      },
      pattern: {
        value: /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,50}$/,
        message:
          "Salasanassa on oltava vähintään 1 iso kirjain, 1 numero ja 1 erikoismerkki.",
      },
    },
    */
  }

  export const num_validation = {
    name: 'num',
    label: 'number',
    type: 'number',
    id: 'num',
    placeholder: 'write a random number',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
    },
  }
  
  export const email_validation = {
    name: 'email',
    label: 'email address',
    type: 'email',
    id: 'email',
    placeholder: 'write a random email address',
    validation: {
      required: {
        value: true,
        message: 'required',
      },
      pattern: {
        value:
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        message: 'not valid',
      },
    },
  }