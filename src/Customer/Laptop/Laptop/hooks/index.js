import { useEffect, useState } from "react";
import api from "../../../../Config/api";

export function useCpu(searchParams) {
  const cpu = searchParams.get("cpuId");
  const [cpus, setCpus] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await api.get("/cpus");
      if (res.data) {
        setCpus(res.data);
      }
    };
    getData();
  }, []);

  return { cpus, cpu };
}

export function useGpu(searchParams) {
  const gpu = searchParams.get("gpuIds");
  const [gpus, setGpus] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await api.get("/gpus");
      if (res.data) {
        setGpus(res.data);
      }
    };
    getData();
  }, []);

  return { gpus, gpu };
}
export function useBrand(searchParams) {
  const brand = searchParams.get("brandId");
  const [brands, setGpus] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const res = await api.get("/brands");
      if (res.data) {
        setGpus(res.data);
      }
    };
    getData();
  }, []);

  return { brands, brand };
}

export function useDiskCapacity(searchParams) {
  const minDiskCapacity = parseInt(searchParams.get("minDiskCapacity")?? 1) ;
  const maxDiskCapacity = parseInt(searchParams.get("maxDiskCapacity")?? 3000) ;
  const [diskCapacity, setDiskCapacity] = useState([minDiskCapacity, maxDiskCapacity]);

  useEffect(()=>{
    setDiskCapacity([minDiskCapacity, maxDiskCapacity])
  },[])

  return { diskCapacity };
}

