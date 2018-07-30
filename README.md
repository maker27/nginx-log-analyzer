# nginx-log-analyzer
## Сортирует ошибочные запросы к серверу (по возрастанию)

#### Пример команды
```
  npm start -- /var/www/nginx/logs/site.log -u -e
```


#### - сортировать по ip
```
node index pathToLogFile --client
```
или
```
node index pathToLogFile -c
```

#### - сортировать по запрошенным url
```
node index pathToLogFile --url
```
или
```
node index pathToLogFile -u
```


#### Расширенная статистика:

* по url с указанием ip
  * `node index pathToLogFile -u --extended`
  
* по ip с указанием запрошенных адресов
  * `node index pathToLogFile -c -e`
