import React from 'react';
import './App.css';
import { InventoryItem, City } from '../../lib/types';

const URL = 'https://nq3igass5e.execute-api.us-east-1.amazonaws.com/Prod';

async function getInventory(): Promise<InventoryItem[]> {
  return (await fetch(`${URL}/get`)) as unknown as InventoryItem[];
}

async function postInventory(item: InventoryItem) {
  return await fetch(`${URL}/get`, {
    method: 'POST',
    body: JSON.stringify(item),
  });
}

async function deleteInventory(item: InventoryItem, comment?: string) {
  return await fetch(
    `${URL}/delete?city=${item.city}&title=${item.title}&comment=${comment}`,
    {
      method: 'DELETE',
    }
  );
}

async function undeleteInventory(item: InventoryItem) {
  return await fetch(`${URL}/delete?city=${item.city}&title=${item.title}`, {
    method: 'POST',
  });
}

function App() {
  const [inventory, setInventory] = React.useState<InventoryItem[]>();

  const [city, setCity] = React.useState<string>('');
  const [title, setTitle] = React.useState<string>('');
  const [description, setDescription] = React.useState<string>('');

  React.useEffect(() => {
    fetchInventory();
  }, []);

  const cities = [
    'Atlanta',
    'Jacksonville',
    'New York City',
    'Los Angeles',
    'Chicago',
  ];

  async function fetchInventory() {
    getInventory().then((c) => {
      setInventory(c);
    });
  }

  async function onSubmit() {
    await postInventory({
      city: city as City,
      title,
      description,
    });
    fetchInventory();
  }

  return (
    <div className="App">
      <h1>Inventory</h1>
      {cities.map((c) => (
        <>
          <h2>{c}</h2>
          {inventory?.map((i) =>
            i?.city === c ? <InventoryDisplay item={i} /> : null
          )}
        </>
      ))}
      <div style={{ marginTop: 50 }} />
      <h5>Add Inventory:</h5>
      <span>City</span>
      <br />
      <Field value={city} setValue={setCity} />
      <br />
      <span>Title</span>
      <br />
      <Field value={title} setValue={setTitle} />
      <br />
      <span>Description</span>
      <br />
      <Field value={description} setValue={setDescription} />
      <br />
      <button onClick={onSubmit}>Submit</button>
    </div>
  );
}

interface InventoryDisplayProps {
  item: InventoryItem;
}

function InventoryDisplay({ item }: InventoryDisplayProps) {
  const [deletionComment, setDeletionComment] = React.useState<string>('');

  async function onDelete() {
    await deleteInventory(item, deletionComment);
  }

  return (
    <>
      <h3>{item.title}</h3>
      <h4>{item.description}</h4>
      <Field value={deletionComment} setValue={setDeletionComment} />
      <button onClick={onDelete}>Delete</button>
    </>
  );
}

interface FieldProps {
  value: string;
  setValue: (arg: string) => void;
}

function Field({ value, setValue }: FieldProps) {
  return (
    <input
      value={value}
      onInput={(event) => {
        setValue((event.target as HTMLTextAreaElement)?.value);
      }}
    />
  );
}

export default App;
