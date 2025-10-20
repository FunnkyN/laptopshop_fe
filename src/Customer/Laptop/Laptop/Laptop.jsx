import { Fragment, useState, useEffect } from "react";
import { Dialog, Disclosure, Menu, Transition } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  ChevronDownIcon,
  FunnelIcon,
  MinusIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/20/solid";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import Pagination from "@mui/material/Pagination";

import { filters, sortOptions } from "./FilterData";
import LaptopCard from "../LaptopCard/LaptopCard";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { findLaptops } from "../../../Redux/Admin/Laptop/Action";
import { Backdrop, CircularProgress, Slider } from "@mui/material";
import { useBrand, useCpu, useDiskCapacity, useGpu } from "./hooks";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Laptop() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const param = useParams();
  const { laptop } = useSelector((store) => store);

  const location = useLocation();
  const [isLoaderOpen, setIsLoaderOpen] = useState(false);

  const handleLoaderClose = () => {
    setIsLoaderOpen(false);
  };

  // --- Lấy dữ liệu từ URL ---
  const decodedQueryString = decodeURIComponent(location.search);
  const searchParams = new URLSearchParams(decodedQueryString);
  const colorValue = searchParams.get("color");
  const sizeValue = searchParams.get("size");
  const price = searchParams.get("price");
  const disccount = searchParams.get("disccout");
  const sortValue = searchParams.get("sort");

  const pageNumber = parseInt(searchParams.get("page") || "1", 10);

  const minRamMemory = parseInt(searchParams.get("minRamMemory") ?? 1);
  const maxRamMemory = parseInt(searchParams.get("maxRamMemory") ?? 100);
  const stock = searchParams.get("stock");
  
  // State riêng cho Slider giá để tránh lag khi kéo
  const [priceRange, setPriceRange] = useState([0, 100000000]);

  // Custom hooks lấy dữ liệu bộ lọc
  const { cpus, cpu } = useCpu(searchParams);
  const { gpus, gpu } = useGpu(searchParams);
  const { diskCapacity } = useDiskCapacity(searchParams);
  const { brands, brand } = useBrand(searchParams);

  const [reload, setReload] = useState(true);

  // --- HANDLERS ---

  // Xử lý sắp xếp
  const handleSortChange = (value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("sort", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Xử lý chuyển trang
  const handlePaginationChange = (event, value) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("page", value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Xử lý thay đổi khoảng giá (Slider)
  const handleChangePrice = (event, newValue) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set("price", `${newValue[0]}-${newValue[1]}`);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
    setPriceRange(newValue);
  };

  // Xử lý bộ lọc checkbox (Màu sắc...)
  const handleFilter = (value, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    let filterValues = searchParams.getAll(sectionId);
    if (filterValues.length > 0 && filterValues[0].split(",").includes(value)) {
      filterValues = filterValues[0].split(",").filter((item) => item !== value);
      if (filterValues.length === 0) {
        searchParams.delete(sectionId);
      }
    } else {
      filterValues.push(value);
    }
    if (filterValues.length > 0)
      searchParams.set(sectionId, filterValues.join(","));
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // Xử lý bộ lọc Radio (CPU, GPU, Brand...)
  const handleRadioFilterChange = (e, sectionId) => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.set(sectionId, e.target.value);
    const query = searchParams.toString();
    navigate({ search: `?${query}` });
  };

  // --- EFFECTS ---

  // Gọi API lấy danh sách laptop khi filter thay đổi
  useEffect(() => {
    const [minPrice, maxPrice] = price === null ? [0, 0] : price.split("-").map(Number);
    const data = {
      category: param.lavelThree,
      color: colorValue || [],
      minPrice: minPrice || priceRange[0],
      maxPrice: maxPrice || priceRange[1],
      minRamMemory,
      maxRamMemory,
      diskCapacity,
      minDiscount: disccount || 0,
      sortPrice: sortValue || "increase",
      page: pageNumber,
      size: 10,
      gpuIds: gpu ? [gpu] : [],
      brandId: brand || "",
      cpuId: cpu || "",
      stock: stock,
    };

    dispatch(findLaptops(data));
  }, [param.lavelThree, colorValue, brand, reload, diskCapacity, sizeValue, minRamMemory, gpu, maxRamMemory, cpu, price, disccount, sortValue, pageNumber, stock, dispatch]);

  // Điều khiển Loader
  useEffect(() => {
    setIsLoaderOpen(!!laptop.loading);
  }, [laptop.loading]);

  const laptopList = laptop?.laptops?.content || [];
  const totalPages = laptop?.laptops?.totalPages || 1;

  // --- COMPONENT CON: Nội dung bộ lọc (Dùng chung cho Mobile và Desktop) ---
  const FilterContent = () => (
    <>
      {/* 1. Bộ lọc Checkbox (Màu sắc) */}
      {filters.map((section) => (
        <Disclosure as="div" key={section.id} className="border-b border-gray-200 py-6">
          {({ open }) => (
            <>
              <h3 className="-my-3 flow-root">
                <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                  <span className="font-medium text-gray-900">{section.name}</span>
                  <span className="ml-6 flex items-center">
                    {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                  </span>
                </Disclosure.Button>
              </h3>
              <Disclosure.Panel className="pt-6">
                <div className="space-y-4">
                  {section.options.map((option, optionIdx) => (
                    <div key={option.value} className="flex items-center">
                      <input
                        id={`filter-${section.id}-${optionIdx}`}
                        name={`${section.id}[]`}
                        defaultValue={option.value}
                        type="checkbox"
                        defaultChecked={option.checked}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        onChange={() => handleFilter(option.value, section.id)}
                      />
                      <label htmlFor={`filter-${section.id}-${optionIdx}`} className="ml-3 text-sm text-gray-600">
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}

      {/* 2. Slider Khoảng giá */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Khoảng giá</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6 px-2">
              <Slider
                getAriaLabel={() => 'Khoảng giá'}
                value={priceRange}
                onChange={(e, val) => setPriceRange(val)}
                onChangeCommitted={handleChangePrice}
                step={500000}
                valueLabelFormat={(value) => `${(value/1000000).toFixed(1)}Tr`}
                min={0}
                max={100000000}
                valueLabelDisplay="auto"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0đ</span>
                <span>100Tr+</span>
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 3. Slider RAM */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">RAM (GB)</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6 px-2">
              <Slider
                value={[minRamMemory, maxRamMemory]}
                onChangeCommitted={(e, value) => {
                  const searchParams = new URLSearchParams(location.search);
                  searchParams.set("minRamMemory", value[0]);
                  searchParams.set("maxRamMemory", value[1]);
                  navigate({ search: `?${searchParams.toString()}` });
                }}
                step={4}
                valueLabelFormat={(value) => `${value} GB`}
                min={4}
                max={64}
                valueLabelDisplay="auto"
                marks
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 4. Radio CPU */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">CPU</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <FormControl>
                <RadioGroup value={cpu} onChange={(e) => handleRadioFilterChange(e, "cpuId")}>
                  {cpus.map((item) => (
                    <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.model} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 5. Radio GPU */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Card đồ họa (GPU)</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <FormControl>
                <RadioGroup value={gpu} onChange={(e) => handleRadioFilterChange(e, "gpuIds")}>
                  {gpus.map((item) => (
                    <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.model} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 6. Slider Ổ cứng */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Ổ cứng (GB)</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6 px-2">
              <Slider
                defaultValue={diskCapacity}
                onChangeCommitted={(e, newValue) => {
                  const searchParams = new URLSearchParams(location.search);
                  searchParams.set("minDiskCapacity", newValue[0]);
                  searchParams.set("maxDiskCapacity", newValue[1]);
                  navigate({ search: `?${searchParams.toString()}` });
                  setReload((prop) => !prop);
                }}
                step={128}
                valueLabelFormat={(value) => `${value} GB`}
                min={128}
                max={2048}
                valueLabelDisplay="auto"
              />
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      {/* 7. Radio Brand */}
      <Disclosure as="div" className="border-b border-gray-200 py-6">
        {({ open }) => (
          <>
            <h3 className="-my-3 flow-root">
              <Disclosure.Button className="flex w-full items-center justify-between bg-white py-3 text-sm text-gray-400 hover:text-gray-500">
                <span className="font-medium text-gray-900">Thương hiệu</span>
                <span className="ml-6 flex items-center">
                  {open ? <MinusIcon className="h-5 w-5" /> : <PlusIcon className="h-5 w-5" />}
                </span>
              </Disclosure.Button>
            </h3>
            <Disclosure.Panel className="pt-6">
              <FormControl>
                <RadioGroup value={brand} onChange={(e) => handleRadioFilterChange(e, "brandId")}>
                  {brands.map((item) => (
                    <FormControlLabel key={item.id} value={item.id} control={<Radio />} label={item.name} />
                  ))}
                </RadioGroup>
              </FormControl>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </>
  );

  return (
    <div className="bg-white -z-20">
      <div>
        {/* --- MOBILE FILTER DIALOG (Popup) --- */}
        <Transition.Root show={mobileFiltersOpen} as={Fragment}>
          <Dialog as="div" className="relative z-40 lg:hidden" onClose={setMobileFiltersOpen}>
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black bg-opacity-25" />
            </Transition.Child>

            <div className="fixed inset-0 z-40 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-12 shadow-xl">
                  <div className="flex items-center justify-between px-4">
                    <h2 className="text-lg font-medium text-gray-900">Bộ lọc</h2>
                    <button
                      type="button"
                      className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400"
                      onClick={() => setMobileFiltersOpen(false)}
                    >
                      <span className="sr-only">Close menu</span>
                      <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Render bộ lọc bên trong Mobile Menu */}
                  <form className="mt-4 border-t border-gray-200 px-4">
                    <FilterContent />
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* --- MAIN CONTENT --- */}
        <main className="mx-auto px-2 lg:px-14">
          <div className="flex items-baseline justify-between border-b border-gray-200 pb-6 pt-5 px-2">
            <h1 className="text-xl lg:text-2xl font-bold tracking-tight text-gray-900">
              Danh sách sản phẩm
            </h1>

            <div className="flex items-center">
              <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
                    Sắp xếp
                    <ChevronDownIcon
                      className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
                      aria-hidden="true"
                    />
                  </Menu.Button>
                </div>

                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-40 origin-top-right rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      {sortOptions.map((option) => (
                        <Menu.Item key={option.name}>
                          {({ active }) => (
                            <p
                              onClick={() => handleSortChange(option.query)}
                              className={classNames(
                                option.current ? "font-medium text-gray-900" : "text-gray-500",
                                active ? "bg-gray-100" : "",
                                "block px-4 py-2 text-sm cursor-pointer"
                              )}
                            >
                              {option.name}
                            </p>
                          )}
                        </Menu.Item>
                      ))}
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>

              <button
                type="button"
                className="-m-2 ml-5 p-2 text-gray-400 hover:text-gray-500 sm:ml-7"
              >
                <span className="sr-only">View grid</span>
                <Squares2X2Icon className="h-5 w-5" aria-hidden="true" />
              </button>
              
              {/* Nút mở bộ lọc (chỉ hiện trên Mobile) */}
              <button
                type="button"
                className="-m-2 ml-4 p-2 text-gray-400 hover:text-gray-500 sm:ml-6 lg:hidden"
                onClick={() => setMobileFiltersOpen(true)}
              >
                <span className="sr-only">Filters</span>
                <FunnelIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </div>

          <section aria-labelledby="laptops-heading" className="pb-24 pt-6">
            <h2 id="laptops-heading" className="sr-only">Laptops</h2>
            <div>
              <div className="grid grid-cols-1 gap-x-8 gap-y-10 lg:grid-cols-5">
                
                {/* --- DESKTOP SIDEBAR FILTER --- */}
                <form className="hidden lg:block border rounded-md p-5 h-fit sticky top-24">
                  <FilterContent />
                </form>

                {/* --- PRODUCT GRID --- */}
                <div className="lg:col-span-4 w-full">
                  <div className="bg-white py-2 lg:py-5 rounded-md">
                    
                    {/* RESPONSIVE GRID: 2 cột mobile, 3 tablet, 4-5 desktop */}
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-2 sm:gap-4 justify-items-center">
                      {laptopList.length > 0 ? (
                        laptopList.map((item) => (
                          item.status === 1 && (
                            <div key={item.id} className="w-full">
                                <LaptopCard laptop={item} />
                            </div>
                          )
                        ))
                      ) : (
                        <div className="col-span-full text-center py-10 text-gray-500">
                          Không tìm thấy sản phẩm phù hợp
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>

        <section className="w-full px-4 lg:px-[3.6rem]">
          <div className="mx-auto px-4 py-5 flex justify-center shadow-lg border rounded-md">
            <Pagination
              count={totalPages}
              page={pageNumber}
              color="primary"
              onChange={handlePaginationChange}
              size="medium"
            />
          </div>
        </section>

        <section>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={isLoaderOpen}
            onClick={handleLoaderClose}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        </section>
      </div>
    </div>
  );
}