const categoryService = require('../services/category');

class CategoryController {
    async getCategories(req, res, next) {
        try {
            const data = await categoryService.getAll();

            return res.status(200).json({
                message: "Lấy thành công",
                data: data
            })
        } catch (err) {
            console.log(err);
            if (err) res.send('Có lỗi')
        }
    }

    async addNew(req, res, next) {
        try {
            const newCate = req.body.title;

            if (!newCate) return res.status(200).json({ message: 'Cần nhập tên danh mục.' });

            const isExisted = await categoryService.find({ title: newCate });
            if (isExisted != '') return res.status(202).json({ message: 'Danh mục đã tồn tại.' })

            const newData = await categoryService.createNew({
                title: req.body.title,
            });

            return res.status(201).json({
                message: "Thêm mới thành công",
                data: newData
            })
        } catch (err) {
            console.log("Lỗi add:", err);
            if (err) res.status(500).json({ message: err })
        }
    }

    async updateCate(req, res, next) {
        try {
            const oldCate = req.body;

            if (!oldCate.title) return res.status(200).json({ message: 'Cần nhập tên danh mục.' });

            const stillExisted = await categoryService.find({ _id: oldCate.id });
            if (stillExisted == '') return res.status(203).json({ message: 'Danh mục không tồn tại.' })

            const isExisted = await categoryService.find({ title: oldCate.title });
            if (isExisted != '' && oldCate.title != stillExisted[0].title) return res.status(202).json({ message: 'Danh mục đã tồn tại.' })

            const newData = await categoryService.update(oldCate.id, { title: oldCate.title })

            return res.status(201).json({
                message: "Cập nhật thành công!",
                data: newData
            })
        } catch (err) {
            console.log(err);
            if (err) res.status(500).json({ message: err })
        }
    }

    async deleteCate(req, res, next) {
        try {
            const idCate = req.params.id;

            const result = await categoryService.delete(idCate);

            if(!result) return res.status(202).json({ message: 'Danh mục không tồn tại'});

            return res.status(200).json({
                message: 'Xóa danh mục thành công'
            })
        } catch (err) { 
            console.log(err);
            if(err) res.status(500).json({ message: err});
        }
    }
}

module.exports = new CategoryController();