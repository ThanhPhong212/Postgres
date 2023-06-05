exports.tinhNo = (data) => {
    const { price, amount, margin } = data;
    //(giá * khối lượng) * margin / (1+margin) -- margin đơn vị phần trăm
    return ((price * amount) * (margin/100) / (1 + margin/100))
}

exports.tinhLai = (data) => {
    const { price, amount, priceCurrent } = data;
    //khối lượng * (giá hiện tại - giá trung bình)
    return amount * (priceCurrent - price)
}

exports.tinhPhanTramLai = (data) => {
    const { price, priceCurrent } = data;
    //(giá hiện tại - giá trung bình)/giá trung bình * 100
    return (priceCurrent - price) / price * 100;
}

exports.tinhGiaTriCoPhieu = (data) => {
    const { priceCurrent, amount } = data;
    //giá hiện tại nhân khối lượng
    return amount * priceCurrent;
}