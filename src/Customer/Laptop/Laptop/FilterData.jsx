import api from "../../../Config/api";

export const filters = [
  {
    id: "color",
    name: "Màu sắc",
    options: [
      { value: "white", label: "White" },
      { value: "beige", label: "Beige" },
      { value: "blue", label: "Blue" },
      { value: "brown", label: "Brown" },
      { value: "green", label: "Green" },
      { value: "purple", label: "Purple" },
      {value:"yellow",label:"Yellow"}
    ],
  }
];

const getColor = async()=>{
  const res = await api.get('/colors')

  if(res?.data){
    filters[0].options = res.data.map((item)=>({value:item.name,label:item.name}))
  }
}

getColor()

export const singleFilter=[
  {
    id: "price",
    name: "Giá",
    options: [
      { value: "100000-500000", label: "100k-500k VND" },
      { value: "500000-1000000", label: "500k-1tr VND" },
      { value: "1000000-10000000", label: "1tr-10tr VND" },
      { value: "10000000-50000000", label: "10tr-50tr VND" },
    ],
  }
]

export const sortOptions = [

  { name: "Price: Low to High", query: "increase", current: false },
  { name: "Price: High to Low", query: "decrease", current: false },
];

