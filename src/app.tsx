  import { component$, useSignal } from '@builder.io/qwik'
  
  import Field from './components/field.tsx';
  import './app.css';
  
  export const App = component$(() => {
    const count = useSignal(0)
  
    return (
      <>
        <div class="flex flex-col gap-2">
         <span> this is the main </span>
          <Field></Field>
        </div>
      </>
    )
  })
