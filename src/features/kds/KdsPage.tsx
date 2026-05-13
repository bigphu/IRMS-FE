import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { KdsQueueOrder, KdsAlert } from "../../types/api";
import { useAppSelector, useAppDispatch } from "../../store/hooks";
import { ScrollArea, Button, DisplayBox } from "../../components"; 
import { DoorOpenIcon, Loader2Icon, PowerCircleIcon, XCircleIcon, ChefHatIcon } from "lucide-react"; 
import { KdsCard } from "./KdsCard";

import { useLogout } from "../../features";
import { logout } from "../../store/slices/authSlice";
import { queryClient } from "../../query";

import { useKdsQueue, useKdsAlerts, useKdsMutations } from "./useKds";

export const KdsPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { mutateAsync: logoutMutation, isPending } = useLogout();
  
  const handleLogout = async () => {
    if (isPending) {
      return;
    }

    try {
      await logoutMutation();
      dispatch(logout());
      queryClient.clear();
    } catch (error) {
      console.error("Logout failed: ", error);
    }
  };

  const isChef = useAppSelector((state) => state.auth.role) === "CHEF";
  
  const { data: queueData = [], isLoading, isError } = useKdsQueue(isChef);
  const { data: alerts = [] } = useKdsAlerts();
  const { startMutation, readyMutation, completeMutation } = useKdsMutations();

  const columnCount = 4;

  const columns = useMemo(() => {
    const cols: KdsQueueOrder[][] = Array.from(
      { length: columnCount },
      () => [],
    );

    queueData.forEach((order, index) => {
      cols[index % columnCount]!.push(order);
    });

    return cols;
  }, [queueData]);

  // Extracted rendering logic helper 
  const renderStatusBox = (variant: string, icon: React.ReactNode, value: string) => (
    <div className="flex flex-col justify-center items-center rounded-2xl w-full flex-1 h-full bg-neutral min-h-[50vh]">
      <div className="w-fit h-fit">
        <DisplayBox variant={variant} icon={icon} value={value} />
      </div>
    </div>
  );

  // The dynamic content renderer
  const renderContent = () => {
    if (isLoading) return renderStatusBox("loading-secondary", <Loader2Icon className="animate-spin" />, "Loading Kitchen Queue...");
    if (isError) return renderStatusBox("danger", <XCircleIcon />, "Failed to load orders!");
    if (queueData.length === 0) return renderStatusBox("secondary", <ChefHatIcon />, "The kitchen queue is empty!");

    return (
      <div className="flex w-full h-full gap-4 items-start">
        {columns.map((columnData, columnIndex) => (
          <div
            key={columnIndex}
            className={"flex flex-col flex-1 gap-4 min-w-0"}
          >
            {columnData.map((data) => {
              const orderAlerts = alerts.filter((alert: KdsAlert) => alert.orderId === data.orderId);

              return (
                <KdsCard
                  key={data.orderId}
                  isChef={isChef}
                  order={data}
                  alerts={orderAlerts}
                  onStart={(orderId, itemId) => 
                    startMutation.mutate({ orderId, itemId })
                  }
                  onReady={(orderId, itemId) => 
                    readyMutation.mutate({ orderId, itemId })
                  }
                  onComplete={(orderId, itemId) => 
                    completeMutation.mutate({ orderId, itemId })
                  }
                />
              );
            })}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="relative flex flex-col h-screen w-screen pl-14 py-10">
      <ScrollArea direction="vertical" className="h-full">
        <div className="flex justify-between pr-13 w-full">
          <h2 className="flex gap-6 items-center text-7xl text-primary">
            {isChef ? "Kitchen Display System" : "Track Your Orders"}
          </h2>
        </div>

        <div className="flex flex-col gap-4 p-6 flex-1 min-h-0">
          {renderContent()}
        </div>
      </ScrollArea>

      <div className="absolute flex justify-center items-center gap-8 z-10 bottom-1/20 right-1/20 text-2xl">
       {isChef ? (
        <Button variant="outline-danger" onClick={() => handleLogout()}>
          <div className="flex items-center justify-center gap-4">
            <PowerCircleIcon />
            <p>{isPending ? "Logging out..." : "Logout"}</p>
          </div>
        </Button>
       ) : (
        <Button variant="outline-danger" onClick={() => navigate(-1)}>
          <div className="flex items-center justify-center gap-4">
            <DoorOpenIcon />
            <p>Back</p>
          </div>
        </Button>
       )}
      </div>
    </div>
  );
};