import { useState } from "react"
import { toast } from "sonner";

export const useFetch = (callback) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [data, setData] = useState(undefined);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true)
    setError(null)
    try {
      const response = await callback(...args)
      setData(response)
      setError(null)
    } catch (error) {
      setError(null)
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return {
    data, loading, error, fn, setData
  }
}