import Form from 'next/form';
 
export default function NewNextForm() {
  return (
    <Form action="/search">
      <input name="query" />
      <button type="submit">Submit</button>
    </Form>
  );
}