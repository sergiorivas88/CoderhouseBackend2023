export const generatorUserError = (user) => {
    return `All params are required.
    Data received:
      - firstName - string  : ${user.firstName} as ${typeof(user.firstName)}
      - lastName - string   : ${user.lastName} as ${typeof(user.lastName)}
      - email - string      : ${user.email} as ${typeof(user.email)}
      - age - number        : ${user.age} as ${typeof(user.age)}
      - password - string   : ${user.password} as ${typeof(user.password)}
      `
  };

export const generatorProductsError = (product) => {
  return `Some params are missing,
  The following params are required and this is the data tha was received:
    - title - string: ${product.title} as ${typeof(product.title)}
    - description - string: ${product.description} as ${typeof(product.description)}
    - price - number: ${product.price} as ${typeof(product.price)}
    - code - string: ${product.code} as ${typeof(product.code)}
    - stock - number: ${product.stock} as ${typeof(product.stock)}
    - category - string: ${product.category} as ${typeof(product.category)}
  `
}

export const generatorUserLoginError = ({email, password}) => {
  return `Email or password invalid.
    Data received:
      - email - string  : ${email} as ${typeof(email)}
      - password - string   : ${password} as ${typeof(password)}
      `
}

export const generatorCartIdError = (id) => {
  return `There is no cart by that id.
  Data received: ${id} as ${typeof(id)}`
}


