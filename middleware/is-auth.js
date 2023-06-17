const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization')
    if (!authHeader) {
        const error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }
    const token = authHeader.split(' ')[1]
    const prefixToken = authHeader.split(' ')[0]
    if (prefixToken !== 'Bearer') {
        const error = new Error('Invalid token type.')
        error.statusCode = 403
        throw error
    }

    let decodedToken
    try {
        decodedToken = jwt.verify(token, process.env.APP_SECRET_KEY)
    } catch (err) {
        err.statusCode = 500
        throw err
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated.')
        error.statusCode = 401
        throw error
    }
    req.userId = decodedToken.userId
    next()
    /* 
    - get 'Authorization' từ header
        Nếu ko có giá trị thì throw 401
    - Tách lấy token từ header header[1]
    - Decode token bằng jwt.verify => decodedToken
    - Gán req.userId = decodedToken.userId
    - Next

    ================================================================
    Test case from chatGPT
    - Throw error nếu ko có Authorization header
    - Throw error nếu token invalid
    - Có userId trong decoded token
    - Có call next() after successful

    ================================================================
    Việc xác định test case cần thiết phụ thuộc nhiều yếu tố
    - Độ phức tạp của code
    - Các edge case

    ================================================================
    Xem xét các yếu tố sau để xem test case đã đủ chưa
    - Basic functionally (chức năng cơ bản)
        Header đủ
        Validate token
    - Edge case: identify and potential edge cases or boundary cases condition có thể dẫn đến hành vi ko mong muốn
        Định dạng token khác nhau
        Token hết hạn
        Token giả mạo
        Các biến thể của Authorization header
    - Error handling: kiểm tra xem cách xử lý các tình huống error khác nhau
        Đưa ra thông báo chính xác
        Mã lỗi chính xác
        Xử lý exception
    - Positive and negative scenarios: test case thành công và ko thành công
    - Integration test: test khi tích hợp với các module, phần khác trong code
        Sử dụng với các route cụ thể
        Sử dụng với các middleware khác

    ================================================================
    Về độ chi tiết của test case:
    Cần đạt sự cân bằng giữa tính kỹ lưỡng và thực tế
    Lý tưởng: bao quát càng nhiều kịch bản càng tốt
    Nhưng cần ưu tiên tập trung các khía cạnh quan trọng nhất
    
     */
}
