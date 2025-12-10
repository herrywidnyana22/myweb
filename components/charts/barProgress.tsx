import { getColor } from "@/lib/utils";
import { Tooltip } from "../tooltip";

export const BarProgressChart = ({value, label}: BarProgressProps) => {
    return ( 
        <Tooltip label={label}>
          <div className="w-full bg-gray-200 rounded-full h-1.5 sm:h-2 mt-2 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(value, 100)}%`,
                backgroundColor: getColor(value),
              }}
            />
          </div>
        </Tooltip>
    );
}