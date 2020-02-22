# shapass-vue

## Project setup

Install the node version set in `.nvmrc` and then:

```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

## Running on Docker

Build and run the application in docker with:

```
docker build -t sp-frontend .
docker run -it -p 8080:80 --rm sp-frontend:latest
```

This is to be used in production, in development `npm run serve` is usually better.
