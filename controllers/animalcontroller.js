const express = require("express");
const router = express.Router();
const { Animal } = require("../models");
// const animalModel = require("..models/animal");
const validateSession = require("../middleware/validate-jwt");

router.post("/create", validateSession, async (req, res) => {
    let {name, legNumber, predator} = req.body.animal;

    try {
        const newAnimal = await Animal.create({
            name,
            legNumber,
            predator,
            userId: req.user.id
        });
        res.status(201).json({
            animal: newAnimal,
            message: "Animal has been created!"
        })
    } catch (error) {
        res.status(500).json({
        message: `Failed to create animal: ${error}`
    })  
    }
});

router.get("/", validateSession, async (req, res) => {
    try {
        const allAnimals = await Animal.findAll({
            where: { userId: req.user.id },
        }); 
        res.status(200).json(
            {allAnimals}
        );
    } catch (error) {
        res.status(500).json({
        error: `You have an error: ${error}`
    });
    }
});

router.delete("/delete/:name", validateSession, async (req, res) => {
    // router.delete("/delete/:id", async (req, res) => {
    // const animalId = req.params.id;
    // await Animal.destroy({where: {id: animalId}})
    const animalToDelete = req.params.name;
    try {
    
        let animal = await Animal.findOne({ 
        where: { 
        name: animalToDelete,
        userId: req.user.id
        }
        });

        if (animal) {
        const query = {
            where: {
            id: animal.id,
            userId: req.user.id
            },
        };
    
        await Animal.destroy(query);
    
        res.status(200).json({
            message: `This animal ${animalToDelete} has been deleted`,
        });
        } else {
        res.status(200).json({
            message: "Animal not found"
            })
        }
    
    } catch (error) {
        res.status(500).json({
        message: `There was an issue deleting this animal: ${error}`,
        error,
        });
    }
    });

router.put("/update/:id", validateSession, async (req, res) => {
    const {name, legNumber, predator} = req.body.animal;

    const query = {
    where: {
    id:  req.params.id,
    userId: req.user.id
    }
}

const updatedAnimal = {
        name: name,
        legNumber: legNumber,
        predator: predator
    }

try {
    const update = await Animal.update(updatedAnimal, query);
    res.status(200).json({
    message: "Animal mutated!",
    update
    })
    } catch (error) {
    res.status(500).json({
        message: `SomEThInG wEnt WroNg!`
    })
}
});

module.exports = router;