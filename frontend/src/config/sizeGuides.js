/**
 * Bảng size theo số đo cơ thể người Việt (cm). `recommend` dùng cho công cụ "Gợi ý size theo chiều cao & cân nặng".
 */
export const sizeGuides = {
  'top-nu': {
    title: 'Áo, đầm, áo khoác nữ',
    columns: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rows: [
      { label: 'Vòng ngực', values: ['78–82', '82–86', '86–90', '90–95', '95–100', '100–106'] },
      { label: 'Vòng eo', values: ['60–64', '64–68', '68–72', '72–77', '77–82', '82–88'] },
      { label: 'Vòng mông', values: ['84–88', '88–92', '92–96', '96–101', '101–106', '106–112'] },
      { label: 'Chiều cao', values: ['148–155', '153–158', '156–162', '160–166', '163–170', '165–172'] },
    ],
    recommend: [
      { size: 'XS', maxWeight: 44 },
      { size: 'S', maxWeight: 50 },
      { size: 'M', maxWeight: 56 },
      { size: 'L', maxWeight: 63 },
      { size: 'XL', maxWeight: 70 },
      { size: 'XXL', maxWeight: 200 },
    ],
  },
  'top-nam': {
    title: 'Áo, sơ mi, áo khoác nam',
    columns: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rows: [
      { label: 'Vòng ngực', values: ['84–88', '88–94', '94–100', '100–106', '106–112', '112–118'] },
      { label: 'Vòng eo', values: ['68–72', '72–78', '78–84', '84–90', '90–96', '96–102'] },
      { label: 'Dài tay', values: ['59', '60', '61', '62', '63', '64'] },
      { label: 'Chiều cao', values: ['158–164', '163–169', '168–174', '172–178', '176–182', '178–186'] },
    ],
    recommend: [
      { size: 'XS', maxWeight: 52 },
      { size: 'S', maxWeight: 59 },
      { size: 'M', maxWeight: 67 },
      { size: 'L', maxWeight: 75 },
      { size: 'XL', maxWeight: 84 },
      { size: 'XXL', maxWeight: 250 },
    ],
  },
  'bottom-nu': {
    title: 'Quần, chân váy nữ',
    columns: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rows: [
      { label: 'Vòng eo', values: ['60–64', '64–68', '68–72', '72–77', '77–82', '82–88'] },
      { label: 'Vòng mông', values: ['84–88', '88–92', '92–96', '96–101', '101–106', '106–112'] },
      { label: 'Dài quần (trong)', values: ['74', '75', '76', '77', '78', '78'] },
      { label: 'Size số', values: ['25–26', '27', '28', '29–30', '31', '32'] },
    ],
    recommend: [
      { size: 'XS', maxWeight: 44 },
      { size: 'S', maxWeight: 50 },
      { size: 'M', maxWeight: 56 },
      { size: 'L', maxWeight: 63 },
      { size: 'XL', maxWeight: 70 },
      { size: 'XXL', maxWeight: 200 },
    ],
  },
  'bottom-nam': {
    title: 'Quần, jeans nam',
    columns: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    rows: [
      { label: 'Vòng eo', values: ['70–74', '74–78', '78–83', '83–88', '88–94', '94–100'] },
      { label: 'Vòng mông', values: ['86–90', '90–95', '95–100', '100–105', '105–110', '110–116'] },
      { label: 'Dài quần (trong)', values: ['78', '79', '80', '81', '82', '82'] },
      { label: 'Size số', values: ['28', '29', '30–31', '32', '33–34', '36'] },
    ],
    recommend: [
      { size: 'XS', maxWeight: 52 },
      { size: 'S', maxWeight: 59 },
      { size: 'M', maxWeight: 67 },
      { size: 'L', maxWeight: 75 },
      { size: 'XL', maxWeight: 84 },
      { size: 'XXL', maxWeight: 250 },
    ],
  },
  kids: {
    title: 'Trẻ em',
    columns: ['2-3T', '4-5T', '6-7T', '8-9T', '10-11T', '12-13T'],
    rows: [
      { label: 'Chiều cao', values: ['92–98', '104–110', '116–122', '128–134', '140–146', '152–158'] },
      { label: 'Cân nặng (kg)', values: ['13–16', '16–20', '20–25', '25–31', '31–38', '38–46'] },
      { label: 'Vòng ngực', values: ['53', '56', '60', '65', '70', '76'] },
    ],
    recommendByHeight: [
      { size: '2-3T', maxHeight: 98 },
      { size: '4-5T', maxHeight: 110 },
      { size: '6-7T', maxHeight: 122 },
      { size: '8-9T', maxHeight: 134 },
      { size: '10-11T', maxHeight: 146 },
      { size: '12-13T', maxHeight: 200 },
    ],
  },
  shoes: {
    title: 'Giày',
    columns: ['35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
    rows: [{ label: 'Dài bàn chân (cm)', values: ['22,5', '23', '23,5', '24', '24,5', '25', '25,5', '26', '26,5', '27'] }],
  },
}

export const howToMeasure = [
  { key: 'nguc', label: 'Vòng ngực', text: 'Đo vòng quanh phần đầy nhất của ngực, thước dây song song mặt đất.' },
  { key: 'eo', label: 'Vòng eo', text: 'Đo quanh phần nhỏ nhất của eo, thường cao hơn rốn khoảng 2–3 cm.' },
  { key: 'mong', label: 'Vòng mông', text: 'Đứng chụm chân, đo quanh phần đầy nhất của mông.' },
  { key: 'tay', label: 'Dài tay', text: 'Đo từ đầu vai, qua khuỷu tay hơi gập, đến cổ tay.' },
]

/**
 * Gợi ý size: dựa trên cân nặng, điều chỉnh theo chiều cao (cao hơn khung → tăng 1 size) và sở thích mặc rộng/ôm.
 * Trả về { size, note } hoặc null.
 */
export function recommendSize(guideKey, { heightCm, weightKg, preference = 'vua' }) {
  const g = sizeGuides[guideKey]
  if (!g || !heightCm) return null
  let idx
  if (g.recommendByHeight) idx = g.recommendByHeight.findIndex((r) => heightCm <= r.maxHeight)
  else {
    if (!weightKg || !g.recommend) return null
    idx = g.recommend.findIndex((r) => weightKg <= r.maxWeight)
    const heightRow = g.rows.find((r) => r.label === 'Chiều cao')
    if (heightRow) {
      const [, maxH] = heightRow.values[idx].split('–').map(Number)
      if (heightCm > maxH + 3) idx += 1
    }
  }
  if (preference === 'rong') idx += 1
  if (preference === 'om') idx -= 1
  idx = Math.max(0, Math.min(g.columns.length - 1, idx))
  return { size: g.columns[idx], note: preference === 'rong' ? 'đã tăng 1 size để mặc thoải mái' : preference === 'om' ? 'đã giảm 1 size để mặc ôm' : null }
}
