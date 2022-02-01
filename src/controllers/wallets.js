/* eslint-disable camelcase */
const modelWallets = require('../models/wallets')
const createError = require('http-errors')
const commonHelper = require('../helpers/common')
const client = require('../config/redis')

const getWallets = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 4
    const offset = (page - 1) * limit
    const result = await modelWallets.getWallets({
      offset: offset,
      limit: limit
    })
    const resultCount = await modelWallets.countWallets()
    const { total } = resultCount[0]
    client.setEx('product', 60 * 60, JSON.stringify(result))
    commonHelper.response(res, result, 200, 'data found', {
      currentPage: page,
      limit: limit,
      totalData: total,
      totalPage: Math.ceil(total / limit)
    })
  } catch (error) {
    console.log(error)
    const err = new createError.InternalServerError()
    next(err)
  }
}

const insertWallets = async (req, res, next) => {
  try {
    const { first_name, last_name, phone_number, balance, id_user } = req.body
    const data = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      balance: balance,
      id_user: id_user
    }
    await modelWallets.insertWallets(data)
    commonHelper.response(res, data, 201, 'submitted successfully')
  } catch (error) {
    console.log(error)
    const err = new createError.InternalServerError()
    next(err)
  }
}

const updateWallets = async (req, res, next) => {
  try {
    const id = req.params.id
    const { first_name, last_name, phone_number, balance, id_user } = req.body
    const data = {
      first_name: first_name,
      last_name: last_name,
      phone_number: phone_number,
      balance: balance,
      id_user: id_user
    }
    await modelWallets.updateWallets(data, id)
    commonHelper.response(res, data, 200, 'updated successfully')
  } catch (error) {
    console.log(error)
    const err = new createError.InternalServerError()
    next(err)
  }
}

const deleteWallets = async (req, res, next) => {
  try {
    const id = req.params.id

    await modelWallets.deleteWallets(id)
    commonHelper.response(res, id, 200, 'deleted successfully')
  } catch (error) {
    console.log(error)
    const err = new createError.InternalServerError()
    next(err)
  }
}

module.exports = {
  getWallets,
  insertWallets,
  updateWallets,
  deleteWallets
}
