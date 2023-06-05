'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {

    await queryInterface.bulkInsert('roles', [
      { value: 'ADMIN', active: true },
      { value: 'INVESTMENT_DIRECTOR', active: true },
      { value: 'ACCOUNTANTS', active: true },
      { value: 'INVESTOR', active: true },
      { value: 'EXPERT', active: true }
    ], {})

    await queryInterface.bulkInsert('users', [
      { code: 'HBM10001', userName: 'admin@gmail.com', email: 'admin@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'admin', roleId: 1, createdAt: "2022-11-03 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10002', userName: 'phong@gmail.com', email: 'phong@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Biện Thanh Phong', roleId: 2, createdAt: "2022-11-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10003', userName: 'tu@gmail.com', email: 'tu@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Trần Thanh Tú', roleId: 3, createdAt: "2022-11-01 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10004', userName: 'nhat@gmail.com', email: 'nhat@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Giang Minh Nhật', roleId: 4, createdAt: "2022-10-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10005', userName: 'nguyen@gmail.com', email: 'nguyen@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Trương Nguyên Ngọc', roleId: 5, createdAt: "2022-9-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10006', userName: 'tai@gmail.com', email: 'tai@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Huỳnh Ngọc Tài', roleId: 4, createdAt: "2022-8-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10007', userName: 'giang@gmail.com', email: 'giang@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Minh Giang', roleId: 3, createdAt: "2022-10-12 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10008', userName: 'cuong@gmail.com', email: 'cuong@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Đỗ văn Cường', roleId: 2, createdAt: "2022-10-22 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10009', userName: 'hai@gmail.com', email: 'hai@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Kiều Hải', roleId: 3, createdAt: "2022-11-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10010', userName: 'thai@gmail.com', email: 'thai@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Văn Thái', roleId: 4, createdAt: "2022-11-03 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10011', userName: 'dat@gmail.com', email: 'dat@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Tấn Đạt', roleId: 5, createdAt: "2022-10-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10012', userName: 'phu@gmail.com', email: 'phu@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Văn Phú', roleId: 4, createdAt: "2022-7-02 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10013', userName: 'hoa@gmail.com', email: 'hoa@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Thị Hòa', roleId: 3, createdAt: "2022-9-22 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10014', userName: 'phat@gmail.com', email: 'phat@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Trần Tấn Phát', roleId: 2, createdAt: "2022-7-12 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10015', userName: 'huy@gmail.com', email: 'huy@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Hà Nhật Huy', roleId: 3, createdAt: "2022-10-12 16:53:40.208+07", updatedAt: new Date() },
      { code: 'HBM10016', userName: 'ngoc@gmail.com', email: 'ngoc@gmail.com', password: '$2a$10$5.j7jhMAcLnOXZaPWdEQge5kdT7tJjsiDdwf0JQKMeELK9d3fV2Ku', fullName: 'Nguyễn Kim Ngọc', roleId: 4, createdAt: "2022-8-12 16:53:40.208+07", updatedAt: new Date() },
    ], {})

    await queryInterface.bulkInsert('stock_exchanges', [
      { name: 'Techcom Securities JSC', code: 'TCBS' },
      { name: 'VPSS Securities JSC', code: 'VPSS' },
      { name: 'Hacinco Joint Stock Company', code: 'HSC' },
      { name: 'Viet Nam Bank For Industry & Trade Securities JSC', code: 'CTS' },
      { name: 'Mirae Asset Securities (Vietnam) Limited Liability Company', code: 'MIR' },
      { name: 'Viet Capital Securities Joint Stock Company', code: 'VCSC' },
      { name: 'Phu Hung Securities Corporation', code: 'PHS' },
      { name: 'FPT Corporation', code: 'FPT' },
      { name: 'SSI Securities Corporation', code: 'SSI' },
      { name: 'VNDirect Securities Corporation', code: 'VND' },
      { name: 'MB Securities JSC', code: 'MBS' },
    ], {})
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete('stock_exchanges', null, {});
    await queryInterface.bulkDelete('users', null, {});
    await queryInterface.bulkDelete('roles', null, {});
  }
};
