import { Router } from "express"; 
 
import { 
  getAllDiaries, 
  getDiaryById, 
  createDiary, 
  updateDiary, 
  deleteDiary, 
} from "../controllers/diary.controllers.js"; 
 
const router = Router(); 
 
router.get("/", getAllDiaries); 
router.get("/:id", getDiaryById); 
router.post("/", createDiary); 
router.put("/:id", updateDiary); 
router.delete("/:id", deleteDiary); 
 
export default router; 