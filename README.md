<img src="docs/logo.png" width="200" align="right">

# Raspberry Wallet Frontend :crystal_ball:

This module is resposible for forntend of Raspberry Wallet. It doesn't contain a lot logic, most of it is TypeScript with React.

![Demo](https://i.imgur.com/dS7OEjs.gif)

## Requirements
- `npm` or `yarn`

## Installation
```bash
# get repo
git clone https://github.com/RaspberryWallet/Frontend.git
cd Frontend

yarn start // will start app in development mode

yarn build // will build production ready app 

```

## Table of contents

[//]: https://atom.io/packages/markdown-toc
- [Requirements](#requirements)
- [Installation](#installation)
- [Table of contents](#table-of-contents)
- [Details](#details)
- [Authors](#authors)
- [Changelog](#changelog)

## Details
Simple UI to work with [Backend](https://github.com/RaspberryWallet/Backend), so make sure it's running before launching webapp. 
This app uses [create-react-app-typescript](https://github.com/wmonk/create-react-app-typescript) to automate whole process of development. 
Frontend <-> Backend communication is made using two techniques:
* Standart operations uses HTTP calls to RESTful Server
* Websockets for bidirectional communication like sending alerts, errors and subscribing to listeners


## Authors

[//]: https://tablesgenerator.com/markdown_tables

| Name                                                 | email                     |
|------------------------------------------------------|---------------------------|
| [Stanisław Barański](https://github.com/stasbar)     | stasbar1995@gmail.com     |
| [Piotr Pabis](https://github.com/pfoof)              | rotworm0@yahoo.pl         |

## Changelog

[//]: https://tablesgenerator.com/markdown_tables

| Version | Is backward- compatible | Changes       | Commit ID                                |
|---------|-------------------------|---------------|------------------------------------------|
|         |                         |               | There are no released versions           |
