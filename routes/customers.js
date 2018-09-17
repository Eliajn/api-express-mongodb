/*jshint esversion: 6 */
const { Customer, validate } = require('../models/customers');
const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name');
  res.send(customers);
});

router.get('/:id/', async (req, res) => {
  const customers = await Customer.findById(req.params.id);
  if (!customers) return req.status(404).send('this customer was not found');
  res.send(customers);
});
router.post('/', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(404).send(error.details[0].message);
    let customer = new Customer(
      {
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold,
      });
    console.log(req.params.id);
    customer = await customer.save();
    res.send(customer);
  });
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);
  console.log(req.params.id);
  const customer = await Customer.findOneAndUpdate(
    {
      _id: req.params.id,
    },
    {
      $set: {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
    });
    if (!customer) return set.status(404).send('something went wrong');
    res.send(customer);
});
router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer) return res.status(404).send('this customer was not found in the database');
  res.send(customer);
});


module.exports = router;
