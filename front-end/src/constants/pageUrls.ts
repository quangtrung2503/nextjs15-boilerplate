const pageUrls = {
  Homepage: '/',
  SignIn: '/sign-in',
  SignUp: '/sign-up',
  PaymentHistory: '/payment-history',
  Tournaments: '/tournament',
  Profile: '/profile',
  Service: {
    Package: '/service-package',
    Payment: '/service-package/payment/',
  },
  Admin: {
    Home: '/admin',
    CityPage: '/admin/city',
    UserManage: '/admin/user',
    Post: '/admin/post',
    Tour: '/admin/tour',
    Theme: '/admin/theme',
    Destination: '/admin/destination'
  },
  Invoices: '/sales/invoices',
  Warehousing: {
    ImportBill: '/warehousing/import_bill',
  },
  Sales: {
    CreateSalesOrder: '/sales/create_sales_order',
  },
  ForgotPassword: '/forgotPassword',
  Register: '/register',
  Blog: '/blog/',
  BlogDetail: (id: number) => `/blog/${id}/`,
  dashboard: '/dashboard',
  sales: {
    createSalesOrder: '/sales/create_sales_order',
    invoices: '/sales/invoices',
    refund: '/sales/refund_invoice',
  },
  Order: {
    OrderBill: '/order/list/',
    orderCreate: '/order/create_order',
    OrderTemp: '/order/temp_order/',
  },
  warehousing: {
    createImportOrder: '/warehousing/create_import_order',
    importBill: '/warehousing/import_bill',
    tempInvoice: '/warehousing/temp_invoice',
    supplierInvoice: '/warehousing/supplier_invoice',
  },
  warehouse: {
    inventoryManagement: '/warehouse/inventory_management',
    checkInventory: '/warehouse/check_inventory',
    export_cancel: '/warehouse/export_cancel',
    salePerson: '/warehouse/sales_person',
    salesImportReport: '/warehouse/sales_import_report',
    profitReport: '/warehouse/profit_report',
    importExistingReport: '/warehouse/import_existing_report',
  },
  cashbook: '/cashbook',
  settings: {
    drug: '/settings/drug',
    product: '/settings/product',
    general_settings: '/settings/general_settings',
    cashbook: '/settings/cashbook',
    basic: '/settings/basic',
  },
  report: {
    salesReport: '/report/sales_report',
  },
  partner: {
    customer: '/customer',
    supplier: '/supplier',
  },
  systemManagement: {
    pharmacy_management: '/systemManagement/pharmacy_management',
    distributor_management: '/systemManagement/distributor_management',
  },
  management: {
    promotionManagement: '/management/promotion_management',
    userManagement: '/management/user_management',
  },
};

export default pageUrls;
