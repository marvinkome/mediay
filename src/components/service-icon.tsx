import { useState, useEffect } from "react";
import { Icon, Image } from "@chakra-ui/react";
import { CiImageOff } from "react-icons/ci";

export const ServiceIcon = ({ src, alt, ...props }: any) => {
  const [hasError, setHasError] = useState(false);
  useEffect(() => {
    setHasError(false);
  }, [src]);

  if (hasError) {
    return <Icon as={CiImageOff} color="rgb(0 0 0 / 60%)" {...props} />;
  }

  return <Image src={src} alt={alt} {...props} onError={() => setHasError(true)} />;
};
