import { Router } from "express";
import { ApiController } from "../controllers/api.controller";

const apiRouter = Router();

// test endpoint
apiRouter.get('/test', ApiController.test);

// init endpoint
apiRouter.post('/initLedger', ApiController.initLedger);

// admin endpoints
apiRouter.post('/admin/createUser', ApiController.createUser);
apiRouter.get('/admin/getAllUsers', ApiController.getAllUsers);

// Manufacturer endpoints
apiRouter.post('/manufacturer/createPhoneAsset', ApiController.createPhoneAsset);  
apiRouter.post('/manufacturer/transferPhone', ApiController.transferPhone);
apiRouter.get('/manufacturer/getPhone/:phoneImei', ApiController.getPhone);
apiRouter.get('/manufacturer/getAllPhones', ApiController.getAllPhones);
// apiRouter.get('/manufacturer/getComponent/:id', ApiController.getComponent);
// apiRouter.get('/manufacturer/getAllComponents', ApiController.getAllComponents);

// Supplier endpoints
// apiRouter.post('/supplier/createComponent', ApiController.createComponent);
// apiRouter.post('/supplier/transferComponent', ApiController.transferComponent);
// apiRouter.get('/supplier/getComponent/:id', ApiController.getComponent);
// apiRouter.get('/supplier/getAllComponents', ApiController.getAllComponents);

// Customer endpoints
// apiRouter.post('/customer/transferPhone', ApiController.transferPhone);
// apiRouter.get('/customer/getPhone/:id', ApiController.getPhone);    

// Recycler endpoints
// apiRouter.delete('/recycler/deletePhone/:id', ApiController.deletePhone);

// Repairer endpoints
// TODO

export default apiRouter;