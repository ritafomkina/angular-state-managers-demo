используя nodejs, express, typescript и SQL базу данных, напиши. мне бекенд с моделями, взятыми из папки models

мне надо иметь следующие апишки:

для юзеров

GET:
/users
возвращает: 10 первых юзеров завернутых в PaginatedResponse<User>
у него есть такие квери параметры (все возвращают юзеров обернутых в PaginatedResponse)

/users?filter=total (возвращает 10 юзеров), /users?filter=works, /users?filter=vacation, /users?filter=sick, /users?filter=dayOff,

/users?sort=location (возвращает юзеров по их локациям в алфавитном порядке), /users?sort=-location (возвращает юзеров по их локациям в противоположном алфавитному порядке), /users?sort=firstName, /users?sort=-firstName, /users?sort=startDate, /users?sort=-startDate,

а так же комбинирование разных фильтров и сортировки:
/users?filter=works&sort=-firstName

также нужно реализовать пагинацию на /users
/users?current=1&size=20

POST:
/users
тело реквеста: {firstName: ‘value', lastName: 'value', email: 'value’}
создается объект с полями: id (генерируется автоматически), firstName, lastName, createdAt, updatedAt, остальные непереданные поля имеют значение null
возвразает: всего юзера

PATCH
/users/:id
тело реквеста: обычный патч полей юзера
возвразает: всего юзера

DELETE
/users/:id
возвращает код ответа, без тела

для проектов
GET:
/projects
возвращает: 10 первых проектов завернутых в PaginatedResponse<Project>
у него есть такие квери параметры:

/projects?filter=total, /projects?filter=support, /projects?filter=completed, /projects?filter=inDevelopment

/projects?sort=title (возвращает проекты по их тайтлам в алфавитном порядке), /projects?sort=-title (возвращает проекты по их тайтлам в противоположном алфавитному порядке), /projects?sort=location, /projects?sort=-location, /projects?sort=startDate, /projects?sort=-startDate

а так же комбинирование разных фильтров и сортировки:
/projects?filter= support&sort=-title

также нужно реализовать пагинацию на /projects
/projects?current=1&size=20

POST:
/projects
тело реквеста: {title: ‘value'}
создается объект с полями: id (генерируется автоматически), title, createdAt, updatedAt, остальные непереданные поля имеют значение null
возвразает: весь проект

PATCH
/projects/:id
тело реквеста: обычный патч полей проекта
возвразает: весь проект

DELETE
/projects/:id
возвращает код ответа, без тела

для оборудования
GET:
/equipment
возвращает: 10 первых оборудований завернутых в PaginatedResponse<Equipment>
у него есть такие квери параметры:

/equipment?filter=total, /equipment?filter=available , /equipment?filter=occupied

сортировки нет

также нужно реализовать пагинацию на /equipment
/equipment?current=1&size=20

/equipment
тело реквеста: {title: ‘value’, description: ‘value’, status: EquipmentStatusEnum, owner: ‘id’, receiptTimestamp: ‘value'}
создается объект с полями: id (генерируется автоматически), createdAt, updatedAt, и все остальные переданные поля, остальные непереданные поля имеют значение null
возвразает: весь объект оборудования

PATCH
/equipment/:id
тело реквеста: обычный патч полей оборудования
возвразает: весь объект оборудования

DELETE
/equipment/:id
возвращает код ответа, без тела

для vacations
GET:
/vacations
возвращает: 10 первых реквестор завернутых в PaginatedResponse<Vacation>
у него есть такие квери параметры:

/vacations?filter=total, /vacations?filter=dayOff , /vacations?filter=sickLeave, /vacations?filter=vacation

/vacations?sort=firstName (возвращает реквесты по именм их user поля, в алфавитном порядке), /vacations?sort=-firstName (наоборот), /vacations?sort=type, /vacations?sort=-type, /vacations?sort=daysAvailable, /vacations?sort=-daysAvailable, /vacations?sort=daysRequested, /vacations?sort=-daysRequested, /vacations?sort=createdDate, /vacations?sort=-createdDate, /vacations?sort=startDate, /vacations?sort=-startDate, /vacations?sort=status, /vacations?sort=-status

также нужно реализовать пагинацию на /vacations
/vacations?current=1&size=20

POST
/vacations
тело реквеста: {user: ‘id’, startDate: ‘value’, endDate: ‘value’, type: VacationTypeEnum, owner: ‘id’, receiptTimestamp: ‘value'}
создается объект с полями: id (генерируется автоматически), createdAt, updatedAt, и все остальные переданные поля, остальные непереданные поля имеют значение null
возвразает: весь объект реквеста на vacation

PATCH
/vacations/:id
тело реквеста: обычный патч полей vacation
возвразает: весь объект vacation

DELETE
/vacations/:id
возвращает код ответа, без тела

Summary

GET
/equipment/summary
возвращает объект с полями total, occupied, available (с реальным значением для каждого поля

GET
/projects/summary
возвращает объект интерфейса ProjectsSummary (с реальным значением для каждого поля)

/users/summary
возвращает объект интерфейса UsersSummary (с реальным значением для каждого поля)

/vacations/summary
возвращает объект интерфейса ({total: number, sickLeave: number, dayOff: number, vacation: number})

разверни приложение на порту 8000
заполни базу данных объектами из папки mocks
