# Mongo Transaction [ ref-link ](https://medium.com/cashpositive/the-hitchhikers-guide-to-mongodb-transactions-with-mongoose-5bf8a6e22033)

## Getting Started

1. Let’s get a minimal setup going for using MongoDB transaction working with Mongoose. Assuming we are using run-rs for the development environment, we first install run-rs globally —

`$ npm i -g run-rs`

2. Then, we run run-rs command to get our replica sets running

```
// to run-rs with its own separate mongo installation
$ run-rs --version 4.0.0
// to use the mongo installation you've on your system
$ run-rs --mongod
// run-rs usually purges all old data, append --keep to skip purging
$ run-rs --mongod --keep
```

3. install package and start project

```
$ npm i
$ npm run start
```

Note: code ที่ file index.js บรรทัดที่ 44 ตั้งใจทำให้ Step 2 ทำงานไม่สำเร็จ ถ้า run `npm run start` สิ่งที่ได้คือ จะสร้าง database ที่ชื่อว่า example ข้างในมี collection ชื่อ users ใน collection users จะมี users ของ Jane และ John มีเงินคนละ 50

---

### Example

> ตัวอย่างมี 2 users John, Jane ทั้งคู่มีเงินคนละ $50. John โอนเงิน $10 ให้ Jane ถ้าทุกอย่างถูกต้องข้อมูลที่บันทึกลง database ควรจะเป็น

- Step 1 ตัดเงิน $10 ออกจากบัญชี John จาก $50 เหลือ \$40
- Step 2 เพิ่มเงินเข้าไปในบัญชี Jane $10 จาก $50 เป็น \$60

---

without Transaction

ถ้า Step 1 completes คือตัดเงิน \$10 ออกจากบัญชี John แต่ Step 2 fails Jane จะไม่ได้รับเงิน \$10

---

with Transaction

การตัดเงินออกจากบัญชีของ John $10, และเพิ่มให้ Jane $10 จะูกบันทึกลง database ก็ต่อเมื่อ Step 1, Step 2 completes ทั้งคู่ทดสอบได้โดยการ remove code บรรทัดที่ 44 file index.js ออก run `npm run start` แล้วไปดูผลลัพธ์ที่ database

---
