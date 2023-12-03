import CarMaintenanceBookContext from "@/contexts/CarMaintenanceBook.context"
import { useContext } from "react";

const useCarMaintenanceBook = () => {

    const context = useContext(CarMaintenanceBookContext);

    if (!context) throw new Error('useVoting must be used within a CarMaintenanceBookContext');

    return context;
}

export default useCarMaintenanceBook;