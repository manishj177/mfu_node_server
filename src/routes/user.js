import { Router } from 'express';
import controllers from '../controllers';
import middlewares from '../middlewares';


const router = Router();
const { userController } = controllers;
const {
  authMiddleware
} = middlewares;

router.get("/dashboard",
  authMiddleware,
  userController.dashboard
)
router.get("/schemesummary",
  authMiddleware,
  userController.getSchemeSummary
)
export default router;