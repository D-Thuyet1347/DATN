import { useParams } from "react-router-dom";

const ServiceDetails = () => {
  const { id } = useParams(); 

  return <div>Chi tiết dịch vụ: {id}</div>;
};
export default ServiceDetails;
