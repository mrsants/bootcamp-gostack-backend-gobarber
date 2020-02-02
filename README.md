# GoBarber

### bootcamp da Rocketseat

## Contéudo

- Configurando o Projeto
- Nodemon & Sucrase
- Conceitos de Docker
- Mão na Massa
- Sequelize & MVC
- Padrão de código - Eslint, Prettier & EditorConfig
- Configurando o Sequelize
- Migração de usuário
- Criação do Model de Usuário
- Loader de Models
- Criando usuário
- Enviando password_hash
- Conceitos de JWT
- Autenticação JWT
- Middleware de autenticação
- Update do usuário
- Validando dados de entrada

## Configurações
```
yarn init -y

yarn add sucrase nodemon -D

yarn sucrase-node src/server.js

```
## Eslint + p`rettier
```
 yarn add eslint -D

 yarn eslint --init

 ❯ To check syntax, find problems, and enforce code style

 ❯ Airbnb, Standard
```

## Na raiz defina:

```
{
  "execMap": {
    "js": "sucrase-node"
  }
}
```

### e no seu package.json:

```
"scripts": {
    "dev": "nodemon src/server"
  },
```

## DockerFile

```
  # Partimos de uma imagem existente
  FROM node:10
  # Definimos a pasta e copiamos o arquivos
  WORKDIR /usr/app
  COPY . ./
  # Instalamos as dependências
  RUN yarn
  # Qual porta queremos expor?
  EXPOSE 3333
  # Executamos nossa aplicação
  CMD yarn start
```

## Docker com postgres

```
   docker run --name database -e POSTGRES_PASSWORD=docker -p 5432:5432 -d postgres

   docker run -d 30bf4f039abe

   docker start a46a366365bb

   docker image ls

   docker ps

   docker  start gobarber

   docker logs postgres
```

##  Sequelize

```
  const { resolve } = require('path');

  module.exports = {
    config: resolve(__dirname, 'src', 'config', 'database.js'),
    'models-path': resolve(__dirname, 'src', 'app', 'models'),
    'migrations-path': resolve(__dirname, 'src', 'database', 'migrations'),
    'seeders-path': resolve(__dirname, 'src', 'database', 'seeds'),
  };
```

```

User.create({ name: 'teste' , email: 'teste@teste.com.br' , })

User.findOne({ where: { email: 'teste@teste.com.br' } })

```
## Migrations

```
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable('users');
  },
};

```

## Controller (index, store, show, update, delete)

```
class UserController {
 index() { }
 show() { }
 store() { }
 update() { }
 delete() { }
}

```

# Yup

```
 const schema = Yup.object().shape({
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
```

## JWT

```
    token: jwt.sign({ id }, authConf.secret, {
      expiresIn: authConf.expireIn,
    }),

    &

    const decoded = await promisify(jwt.verify)(token, authConfig.secret);

    Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NiwiaWF0IjoxNTY4NDA1MDAyLCJleHAiOjE1NjkwMDk4MDJ9.NPwa4vr80wAeEJvX9XWNMQAsUWXaDoSUwuw1KAR4wVw
```
