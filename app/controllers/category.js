const categoryService = require('../services/category');

class CategoryController {
    async getCategories (req, res, next) {
        try {
            const data = await categoryService.getAll();

            return res.status(200).json({
                message: "Lấy thành công",
                data: data
            })
        } catch (err) {
            console.log(err);
            if(err) res.send('Có lỗi')
        }
    }

    async addNew (req, res, next) {
        try {
            const newData = await categoryService.createNew({
                title: req.body.title,
                description: req.body.description
            });

            console.log(newData);

            return res.status(201).json({
                message: "Thêm mới thành công",
                data: newData
            })
        } catch (err) {
            console.log(err);
            if(err) res.send('Có lỗi')
        }
    }
}

module.exports = new CategoryController();