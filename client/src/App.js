import React, { useCallback, useState } from "react";
import "./App.css";
import useFetchAPiTodo from "./Hooks/useFetchAPiTodo";
import { ChecklistMajor, DeleteMajor } from "@shopify/polaris-icons";
import {
  AppProvider,
  Page,
  Modal,
  ResourceList,
  ResourceItem,
  ButtonGroup,
  Button,
  Text,
  Card,
  TextField,
  FormLayout,
  Badge,
  InlineStack,
} from "@shopify/polaris";

function App() {
  const { todoes, loading, addTodo : addTodoes, completeTodo : completeTodoes, deleteTodo : deleteTodoes, bulkTodoes } = useFetchAPiTodo();
  const [valueInput, setvalueInput] = React.useState("");
  const [active, setActive] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);

  const handleChange = useCallback(() => setActive(!active), [active]);

  const promotedBulkActions = [
    {
      content: 'Complete',
      onAction: () => { 
        bulkTodo(selectedItems, "complete")
        setSelectedItems([])
      },
    },
    {
      content: 'Incomplete',
      onAction: () => { 
        bulkTodo(selectedItems, "incomplete") 
        setSelectedItems([])
      },
    },
    {
      content: 'Delete',
      onAction: () => { 
        bulkTodo(selectedItems, "delete") 
        setSelectedItems([])
      },
    },
  ];

  const addTodo = async (text) => {
    addTodoes({ text, isCompleted: false });
  };

  const handleSubmit = async (e) => {
    if (!valueInput) return;
    await addTodo(valueInput);
    setvalueInput("");
  };

  const completeTodo = (todo) => {
    todo.isCompleted = !todo.isCompleted;
    completeTodoes(todo.uuid, todo);
  };

  const removeTodo = (id) => {
    deleteTodoes(id);
  };

  const bulkTodo = (ids, action) => {
    bulkTodoes({ids, action});
  };  

  return (
    <AppProvider i18n={{}}>
      <Page
        title={"Todoes"}
        primaryAction={{
          content: "Add new",
          onAction: handleChange,
        }}
      >
        <Card>
          <Modal
            open={active}
            onClose={handleChange}
            title="Add new Todo"
            primaryAction={{
              content: "Add ",
              onAction: async () => {
                await handleSubmit();
                setActive(false);
              },
              loading: loading,
            }}
            secondaryActions={[
              {
                content: "Cancel",
                onAction: () => setActive(false),
              },
            ]}
          >
            <Modal.Section>
              <FormLayout>
                <TextField
                  label={"Title"}
                  value={valueInput}
                  onChange={(val) => setvalueInput(val)}
                  autoComplete={"false"}
                />
              </FormLayout>
            </Modal.Section>
          </Modal>
          <ResourceList
            loading={loading}
            resourceName={{ singular: "todo", plural: "todoes" }}
            items={todoes}
            renderItem={renderItem}
            idForItem={(item) => item.uuid}
            selectedItems={selectedItems}
            onSelectionChange={setSelectedItems}
            promotedBulkActions={promotedBulkActions}
            selectable
          />
        </Card>
      </Page>
    </AppProvider>
  );

  function renderItem(todo) {
    const { uuid, text, isCompleted } = todo;
    return (
      <ResourceItem id={uuid}>
        <InlineStack align="space-between" blockAlign="center">
          <Text variant="bodyLg" as="h3" fontWeight={600} fill>
            {text}
          </Text>
          <ButtonGroup>
            <Badge tone={isCompleted ? "success" : "attention"}>
              {isCompleted ? "Complete" : "Incomplete"}
            </Badge>
            <Button icon={ChecklistMajor} onClick={() => completeTodo(todo)}>
              Complete
            </Button>
            <Button
              tone="critical"
              destructive
              icon={DeleteMajor}
              content={"Delete"}
              onClick={() => removeTodo(uuid)}
            >
              Delete
            </Button>
          </ButtonGroup>
        </InlineStack>
      </ResourceItem>
    );
  }
}

export default App;
