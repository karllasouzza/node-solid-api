# App

GymPass style app

## RFs (requisitos funcionais)

- [ ] Deve ser possivel se cadastrar;
- [ ] Deve ser possivel se autenticar;
- [ ] Deve ser possivel obter um perfil de um usuário logado;
- [ ] Deve ser possivel obter o numero de check-ins realizados por um usuário logado;
- [ ] Deve ser possivel o usuário obter seu historico de check-ins;
- [ ] Deve ser possivel o usuario buscar academias próximas;
- [ ] Dee ser possivel o usuario buscar uma academias pelo nome;
- [ ] Deve ser possivel o usuário realizar check-in em uma academia;
- [ ] Deve ser possivel validar o check-in de um usuário;
- [ ] Deve ser possivel cadastrar uma academia;

## RNs (Regras de negocio)

- [ ] O usuário nnão deve poder se cadastrar com um email já existente;
- [ ] o usuário não pode fazer 2 check-ins no mesmo dia;
- [ ] O usuário não pode fazer check-in se não estiver perto (<= 100 metros) da academia;
- [ ] O check-in só pode ser validado se tiver sido criado há menos de 20 minutos;
- [ ] o check-in só pode ser validado por administradores;
- [ ] a academia só pode ser cadastrada por administradores;

## RNFs (Requisitos não funcionais)

- [ ] a senha do usuário deve estar criptografada;
- [ ] os dados da aplicação precisam estar persistidas em um banco de dados PostgreSQL;
- [ ] Todas listas de dados precisam estar paginadas com 20 itens por página;
- [ ] O usuário deve ser identificado por um JWT token
