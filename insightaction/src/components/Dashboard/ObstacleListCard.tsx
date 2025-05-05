import { useState } from "react";
import { PenLine, Save, Trash2, Shield, Swords, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

const ObstacleItem = ({
  obstacle,
  onSave,
  onDelete,
  onAdd,
}: {
  obstacle: any[];
  onSave: (
    id: string,
    description: string,
    solution: string,
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onAdd: (description: string, solution: string) => Promise<any>;
}) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newDescription, setNewDescription] = useState("");
  const [newSolution, setNewSolution] = useState("");

  const handleAddNew = async () => {
    if (newDescription.trim()) {
      console.log("Adding new obstacle:", newDescription, newSolution);
      const newObstacle = await onAdd(newDescription, newSolution);
      if (newObstacle?.success) {
        // Don't mutate the props directly - the parent component should handle updates
        // obstacle.push(newObstacle);
      }
      setNewDescription("");
      setNewSolution("");
      setIsAddingNew(false);
    }
  };

  const renderAddNewForm = () => (
    <div className="mb-2 rounded-md border border-primaryOrange bg-gray-900/60 p-3">
      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-primaryOrange">
            Obstacle
          </label>
          <Textarea
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            className="min-h-16 border-gray-700 bg-gray-800 text-sm text-white"
            placeholder="What's standing in your way?"
            rows={1}
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-primaryOrange">
            Solution
          </label>
          <Textarea
            value={newSolution}
            onChange={(e) => setNewSolution(e.target.value)}
            className="min-h-16 border-gray-700 bg-gray-800 text-sm text-white"
            placeholder="How will you overcome this obstacle?"
            rows={1}
          />
        </div>
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingNew(false)}
            className="h-7 border-gray-600 text-xs text-gray-300 hover:bg-gray-800"
          >
            Cancel
          </Button>
          <Button
            variant="default"
            size="sm"
            onClick={handleAddNew}
            className="h-7 bg-primaryOrange text-xs font-medium text-black hover:bg-primaryOrange/80"
          >
            <Save size={12} className="mr-1" /> Save
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAddButton = () => (
    <Button
      onClick={() => setIsAddingNew(true)}
      className="group h-10 w-full border border-dashed border-gray-600 bg-gray-900/20 text-gray-300 transition-all duration-200 hover:border-primaryOrange hover:bg-gray-900/40 hover:text-primaryOrange"
    >
      <Plus size={16} className="mr-2 group-hover:text-primaryOrange" />
      <span className="text-xs font-medium">Add Obstacle</span>
    </Button>
  );

  if ((!obstacle || obstacle.length === 0) && !isAddingNew) {
    return (
      <div className="space-y-4">
        <div className="mb-5 flex text-xs text-gray-400">
          <Swords size={16} className="mr-2" /> OBSTACLES & SOLUTIONS
        </div>

        <div className="mb-4 flex items-center justify-center rounded-md border border-dashed border-gray-600 bg-gray-900/40 p-4 text-center">
          <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-gray-800">
            <Shield className="text-primaryOrange" size={16} />
          </div>
          <p className="text-gray-300">No obstacles tracked yet</p>
        </div>

        {renderAddButton()}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="mb-5 flex text-xs text-gray-400">
        <Swords size={16} className="mr-2" /> OBSTACLES & SOLUTIONS
      </div>

      {obstacle &&
        obstacle.map((item: any) => (
          <ObstacleCard
            key={item.id}
            item={item}
            onSave={onSave}
            onDelete={onDelete}
          />
        ))}

      {isAddingNew ? renderAddNewForm() : renderAddButton()}
    </div>
  );
};

const ObstacleCard = ({
  item,
  onSave,
  onDelete,
}: {
  item: any;
  onSave: (
    id: string,
    description: string,
    solution: string,
  ) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [description, setDescription] = useState(item.description || "");
  const [solution, setSolution] = useState(item.solution || "");

  const handleSave = async () => {
    if (!item.id) {
      console.error("Cannot save obstacle: missing ID");
      return;
    }

    const success = await onSave(item.id, description, solution);
    if (success) {
      // Let's not modify the props directly
      // item.description = description;
      // item.solution = solution;
    }

    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (!item.id) {
      console.error("Cannot delete obstacle: missing ID");
      return;
    }

    try {
      const res = await onDelete(item.id);
    } catch (error) {
      console.error("Error deleting obstacle:", error);
    }
  };

  return (
    <div
      className={`rounded-md border ${isEditing ? "border-primaryOrange bg-gray-900/60" : "border-gray-700 bg-gray-900/30"} mb-2 p-3`}
    >
      {isEditing ? (
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-primaryOrange">
              Obstacle
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-16 border-gray-700 bg-gray-800 text-sm text-white"
              placeholder="What's standing in your way?"
              rows={1}
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-primaryOrange">
              Solution
            </label>
            <Textarea
              value={solution}
              onChange={(e) => setSolution(e.target.value)}
              className="min-h-16 border-gray-700 bg-gray-800 text-sm text-white"
              placeholder="How will you overcome this obstacle?"
              rows={1}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
              className="h-7 border-gray-600 text-xs text-gray-300 hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleSave}
              className="h-7 bg-primaryOrange text-xs font-medium text-black hover:bg-primaryOrange/80"
            >
              <Save size={12} className="mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center">
                <div className="mr-2 h-3 w-3 flex-shrink-0 rounded-full bg-primaryOrange"></div>
                <h4 className="font-medium text-white">{item.description}</h4>
              </div>

              {item.solution && (
                <div className="ml-5 mt-2 text-sm text-gray-300">
                  <span className="text-xs font-medium text-primaryOrange">
                    Solution:
                  </span>{" "}
                  {item.solution}
                </div>
              )}
            </div>
            <div className="ml-2 flex space-x-1">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="h-6 w-6 rounded-full p-0 text-gray-400 hover:bg-gray-800/60 hover:text-primaryOrange"
                title="Edit"
              >
                <PenLine size={14} />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleDelete}
                className="h-6 w-6 rounded-full p-0 text-gray-400 hover:bg-gray-800/60 hover:text-red-500"
                title="Delete"
              >
                <Trash2 size={14} />
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObstacleItem;
