# AI Coding Rules - 编码原则

## 核心原则

在所有编码任务中，必须严格遵循以下三大核心原则：

---

## 1. SOLID 原则

### S - Single Responsibility Principle (单一职责原则)
- **定义**: 一个类/模块/函数应该只有一个引起它变化的原因
- **规则**:
  - 每个类只负责一个功能领域
  - 每个函数只做一件事情
  - 避免"上帝类"和"万能函数"
- **示例**:
  ```javascript
  // ❌ 错误: 一个类承担多个职责
  class UserManager {
    saveToDatabase() {}
    sendEmail() {}
    generateReport() {}
  }

  // ✅ 正确: 职责分离
  class UserRepository {
    save() {}
  }

  class EmailService {
    send() {}
  }

  class ReportGenerator {
    generate() {}
  }
  ```

### O - Open/Closed Principle (开放封闭原则)
- **定义**: 对扩展开放，对修改封闭
- **规则**:
  - 通过抽象和接口实现扩展
  - 新功能通过添加代码实现，而非修改现有代码
  - 使用多态、策略模式等设计模式
- **示例**:
  ```javascript
  // ❌ 错误: 每次添加新类型都要修改现有代码
  function calculateArea(shape) {
    if (shape.type === "circle") {
      return Math.PI * shape.radius ** 2;
    } else if (shape.type === "rectangle") {
      return shape.width * shape.height;
    }
  }

  // ✅ 正确: 使用多态
  class Shape {
    area() {
      throw new Error('Method must be implemented');
    }
  }

  class Circle extends Shape {
    constructor(radius) {
      super();
      this.radius = radius;
    }
    area() {
      return Math.PI * this.radius ** 2;
    }
  }

  class Rectangle extends Shape {
    constructor(width, height) {
      super();
      this.width = width;
      this.height = height;
    }
    area() {
      return this.width * this.height;
    }
  }
  ```

### L - Liskov Substitution Principle (里氏替换原则)
- **定义**: 子类必须能够替换其基类而不影响程序正确性
- **规则**:
  - 子类不应该改变父类方法的预期行为
  - 子类可以扩展但不应该削弱父类功能
  - 避免违反契约的继承
- **示例**:
  ```javascript
  // ❌ 错误: 子类改变了父类行为
  class Bird {
    fly() {
      return "flying";
    }
  }

  class Penguin extends Bird {  // 企鹅不会飞！
    fly() {
      throw new Error("Can't fly");
    }
  }

  // ✅ 正确: 重新设计类层次
  class Bird {
    move() {}
  }

  class FlyingBird extends Bird {
    fly() {
      return "flying";
    }
  }

  class Penguin extends Bird {
    swim() {
      return "swimming";
    }
  }
  ```

### I - Interface Segregation Principle (接口隔离原则)
- **定义**: 客户端不应该依赖它不需要的接口
- **规则**:
  - 接口应该小而专注
  - 避免臃肿的接口
  - 按客户端需求拆分接口
- **示例**:
  ```javascript
  // ❌ 错误: 臃肿的接口
  class Worker {
    work() {}
    eat() {}
    sleep() {}
  }

  // ✅ 正确: 接口分离
  class Workable {
    work() {}
  }

  class Eatable {
    eat() {}
  }

  class Sleepable {
    sleep() {}
  }

  // 使用组合
  class Human {
    constructor() {
      this.workable = new Workable();
      this.eatable = new Eatable();
      this.sleepable = new Sleepable();
    }
  }
  ```

### D - Dependency Inversion Principle (依赖倒置原则)
- **定义**: 高层模块不应该依赖低层模块，两者都应该依赖抽象
- **规则**:
  - 依赖于抽象而非具体实现
  - 使用依赖注入
  - 通过接口解耦模块
- **示例**:
  ```javascript
  // ❌ 错误: 直接依赖具体实现
  class EmailService {
    send() {}
  }

  class UserController {
    constructor() {
      this.email = new EmailService();  // 紧耦合
    }
  }

  // ✅ 正确: 依赖抽象
  class MessageService {
    send() {
      throw new Error('Method must be implemented');
    }
  }

  class EmailService extends MessageService {
    send() {
      // 发送邮件逻辑
    }
  }

  class SMSService extends MessageService {
    send() {
      // 发送短信逻辑
    }
  }

  class UserController {
    constructor(messageService) {
      this.messageService = messageService;  // 依赖注入
    }
  }

  // 使用
  const controller = new UserController(new EmailService());
  ```

---

## 2. DRY 原则 (Don't Repeat Yourself)

### 定义
- **核心思想**: 每一个知识点在系统中都应该有一个单一、明确、权威的表示

### 规则
1. **消除重复代码**
   - 相同逻辑出现两次即应提取
   - 三次规则：第三次重复时必须重构

2. **提取公共逻辑**
   - 使用函数、类、模块封装
   - 使用继承或组合复用代码

3. **避免的重复类型**
   - 代码重复
   - 文档重复（代码即文档）
   - 数据重复
   - 逻辑重复

### 示例
```javascript
// ❌ 错误: 重复代码
function calculateTotalPriceUSD(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total * 1.1;  // 加税
}

function calculateTotalPriceEUR(items) {
  let total = 0;
  for (const item of items) {
    total += item.price * item.quantity;
  }
  return total * 1.2;  // 加税
}

// ✅ 正确: 提取公共逻辑
function calculateSubtotal(items) {
  return items.reduce((total, item) => total + item.price * item.quantity, 0);
}

function calculateTotalPrice(items, taxRate) {
  return calculateSubtotal(items) * (1 + taxRate);
}

// 使用
const priceUSD = calculateTotalPrice(items, 0.1);
const priceEUR = calculateTotalPrice(items, 0.2);
```

### 例外情况
- 不同领域的偶然相似代码（不要过度抽象）
- 性能关键路径上的必要重复
- 测试代码中的重复（为了可读性）

---

## 3. KISS 原则 (Keep It Simple, Stupid)

### 定义
- **核心思想**: 简单性应该是设计的关键目标，避免不必要的复杂性

### 规则
1. **优先选择简单方案**
   - 能用简单方法解决就不用复杂方法
   - 不要过早优化
   - 不要过度设计

2. **代码可读性优先**
   - 清晰胜过聪明
   - 显式胜过隐式
   - 简单胜过复杂

3. **避免的复杂性**
   - 过度抽象
   - 不必要的设计模式
   - 过多的继承层次
   - 过度工程化

### 示例
```javascript
// ❌ 错误: 过度复杂
class NumberProcessorFactoryBuilder {
  createFactory() {
    return new NumberProcessorFactory();
  }
}

class NumberProcessorFactory {
  createProcessor() {
    return new NumberProcessor();
  }
}

class NumberProcessor {
  process(x) {
    return x * 2;
  }
}

// 使用
const result = new NumberProcessorFactoryBuilder()
  .createFactory()
  .createProcessor()
  .process(5);

// ✅ 正确: 简单直接
const double = (x) => x * 2;

// 使用
const result = double(5);
```

### KISS 检查清单
- [ ] 这段代码是否容易理解？
- [ ] 是否使用了最简单的解决方案？
- [ ] 是否有不必要的抽象层？
- [ ] 是否有过早优化？
- [ ] 新手是否能快速理解这段代码？

---

## 综合应用示例

### 场景：用户注册功能

```javascript
// ❌ 违反所有原则的代码
class UserManager {
  registerUser(username, email, password, notify = true) {
    // 验证逻辑
    if (username.length < 3 || username.length > 20) {
      return false;
    }
    if (!email.includes('@')) {
      return false;
    }
    if (password.length < 8) {
      return false;
    }

    // 数据库操作（直接操作，紧耦合）
    const db = require('better-sqlite3')('users.db');
    const stmt = db.prepare('INSERT INTO users VALUES (?, ?, ?)');
    stmt.run(username, email, password);
    db.close();

    // 发送邮件（直接在这里实现，职责混乱）
    if (notify) {
      const nodemailer = require('nodemailer');
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: 'admin@example.com', pass: 'password' }
      });
      transporter.sendMail({
        from: 'admin@example.com',
        to: email,
        text: `Welcome ${username}!`
      });
    }

    return true;
  }
}

// ✅ 遵循所有原则的代码

// SOLID + DRY + KISS
class UserValidator {
  /** 单一职责：只负责验证 */
  validateUsername(username) {
    return username.length >= 3 && username.length <= 20;
  }

  validateEmail(email) {
    const parts = email.split('@');
    return parts.length === 2 && parts[1].includes('.');
  }

  validatePassword(password) {
    return password.length >= 8;
  }
}

class UserRepository {
  /** 单一职责：只负责数据持久化 */
  constructor(dbConnection) {
    this.db = dbConnection;
  }

  save(user) {
    const stmt = this.db.prepare(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)'
    );
    stmt.run(user.username, user.email, user.password);
  }
}

class EmailNotifier {
  /** 单一职责：只负责邮件通知 */
  constructor(emailService) {
    this.emailService = emailService;
  }

  sendWelcomeEmail(user) {
    const message = `Welcome ${user.username}!`;
    this.emailService.send(user.email, message);
  }
}

class User {
  /** 简单的数据类 */
  constructor(username, email, password) {
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class UserRegistrationService {
  /** 协调各个组件，依赖注入 */
  constructor(validator, repository, notifier) {
    this.validator = validator;
    this.repository = repository;
    this.notifier = notifier;
  }

  register(username, email, password) {
    // 验证
    if (!this.validator.validateUsername(username)) {
      return false;
    }
    if (!this.validator.validateEmail(email)) {
      return false;
    }
    if (!this.validator.validatePassword(password)) {
      return false;
    }

    // 保存
    const user = new User(username, email, password);
    this.repository.save(user);

    // 通知
    this.notifier.sendWelcomeEmail(user);

    return true;
  }
}

// 使用示例
const db = require('better-sqlite3')('users.db');
const emailService = require('./emailService');

const validator = new UserValidator();
const repository = new UserRepository(db);
const notifier = new EmailNotifier(emailService);
const registrationService = new UserRegistrationService(validator, repository, notifier);

registrationService.register('john_doe', 'john@example.com', 'password123');
```

---

## AI Coding 检查清单

在生成或审查代码时，必须检查：

### SOLID 检查
- [ ] 每个类/函数是否只有一个职责？
- [ ] 是否可以通过扩展而非修改来添加新功能？
- [ ] 子类是否可以替换父类？
- [ ] 接口是否足够小和专注？
- [ ] 是否依赖抽象而非具体实现？

### DRY 检查
- [ ] 是否存在重复的代码？
- [ ] 相似的逻辑是否已被提取？
- [ ] 是否有重复的配置或数据？

### KISS 检查
- [ ] 是否使用了最简单的解决方案？
- [ ] 代码是否容易理解？
- [ ] 是否有不必要的抽象？
- [ ] 是否过度设计？

---

## 优先级原则

当原则冲突时的优先级：

1. **可读性第一** (KISS)
2. **避免重复** (DRY)
3. **正确的抽象** (SOLID)

**注意**: 不要为了遵循原则而牺牲代码的清晰性和简单性。原则是指导，不是教条。

---

## 总结

- **SOLID**: 保证代码结构合理、易维护、可扩展
- **DRY**: 减少重复，提高可维护性
- **KISS**: 保持简单，优先可读性

**核心理念**: 写出人类易读、易维护、易扩展的代码，而不仅仅是机器能执行的代码。
