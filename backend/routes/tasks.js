const express = require("express");
const router = express.Router();
const Task  = require("../models/Task");
const authMiddleware = require("../middleware/authMiddleware");

//CREATE TASK
router.post("/", authMiddleware, async (req,res) => {
    try{
        const {title, description, dueDate, priority, status}= req.body;

        const task= new Task({
             user: req.user.id, title, description, dueDate, priority, status});
             const savedTask = await task.save();
             res.json(savedTask);
        }
        catch(err){
            res.status(500).json({error: "SERVER ERROR!"});
        }
            });


//READ TASKS
router.get("/", authMiddleware,async (req,res) =>{
    try{
        const tasks = await Task.find({ user: req.user.id});
        res.json(tasks);
    }catch(err){
            res.status(500).json({error: "SERVER ERROR!"});
        }

});

//UPDATE TASKS
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });

    if (!task) {
      return res.status(404).json({ message: "TASK NOT FOUND!" });
    }

    Object.assign(task, req.body);

    const updatedTask = await task.save();
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: "SERVER ERROR!" });
  }
});

//DELETE TASK
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({ message: "TASK NOT FOUND!" });
    }

    res.json({ message: "TASK DELETE SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ error: "SERVER ERROR!" });
  }
});

//MARK TASK AS COMPLETED
router.patch("/:id", authMiddleware, async (req, res) => {
  try {
    const { status } = req.body; 

    
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },   
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "TASK NOT FOUND!" });
    }

    res.json({ message: `TASK MARKED AS ${status.toUpperCase()}!`, task });
  } catch (err) {
    res.status(500).json({ error: "SERVER ERROR!" });
  }
});

//SHOW NO.OF COMPLETE AND PENDING TASK
router.get("/count", authMiddleware,async (req,res) =>{
    try{
        const pendingCount = await Task.countDocuments(
            { user: req.user.id, status:"Pending"}
            );

            const completedCount = await Task.countDocuments(
            { user: req.user.id , status:"Completed"}
            );
        res.json({pending : pendingCount, completed: completedCount});
    }catch(err){
            res.status(500).json({error: "SERVER ERROR!"});
        }

});
module.exports = router;