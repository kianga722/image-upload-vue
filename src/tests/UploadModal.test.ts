import { MAX_FILE_SIZE_BYTES } from '../utils/CONSTANTS';
import HeaderTop from '../components/HeaderTop.vue'
import UploadModal from "../components/UploadModal.vue";

import { vi } from 'vitest'
import { render, waitFor, screen } from '@testing-library/vue'
import userEvent from '@testing-library/user-event';

import { server } from '../mocks/server.js'


beforeAll(() => server.listen())
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())
afterAll(() => server.close())


describe("Testing Upload", () => {
  let fileGood: File;
  let fileGood2: File;
  let fileWrongType: File;

  // Have to mock FormData
  function FormDataMock() {
    const obj = { hello: "world" };
    const blob = new Blob([JSON.stringify(obj, null, 2)], {
        type: "application/json",
    });
    // @ts-ignore
    blob.append = vi.fn();
    return blob;
  }

  beforeEach(
    () => {
      // @ts-ignore
      global.URL.createObjectURL = vi.fn(),

      vi.stubGlobal('FormData', FormDataMock)

      fileGood = new File(["(⌐□_□)"], "fileGood.png", { type: "image/png" }),
      fileGood2 = new File(["test"], "fileTest.jpg", { type: "image/png" }),
      fileWrongType = new File(["txt"], "test.txt", { type: "text" })
    }
  )

  test("Modal should allow file upload and show success message", async () => {
    render({
      template:`
        <div>
          <HeaderTop />                
          <UploadModal />
        </div>
      `,
      components:{ HeaderTop, UploadModal }
    })

    const button = screen.getByRole("button");
    userEvent.click(button)

    await waitFor(async () => {
      expect(screen.getByText(/^Upload Image/)).toBeInTheDocument();
    })  

    expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument(); 

    const input = screen.getByTestId('input') as HTMLInputElement;

    userEvent.upload(input, fileGood);

    await waitFor(async () => {
      expect(input.files![0].name).toStrictEqual(fileGood.name);
    })  
    
    const submit = screen.getByTestId('uploadsubmit')
    expect(screen.getByTestId('uploadpreview')).toBeInTheDocument();
    expect(submit).toBeInTheDocument();

    userEvent.click(submit);

    // Success message
    await waitFor(() => {
      expect(screen.queryByTestId('successmessage')).toBeInTheDocument();
    })

    // Clicking confirm should reset the upload modal
    userEvent.click(screen.getByTestId('successconfirm'));

    await waitFor(() => {
      expect(screen.queryByTestId('successmessage')).not.toBeInTheDocument();
    })

    expect(screen.getByText(/^Upload Image/)).toBeInTheDocument();
    expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument();

    // console.log('screen after', screen.debug())
  })

  test("Should be able to change file inputs before submitting", async () => {
    render({
      template:`
        <div>
          <HeaderTop />                
          <UploadModal />
        </div>
      `,
      components:{ HeaderTop, UploadModal }
    })

    const button = screen.getByRole("button");
    userEvent.click(button)

    await waitFor(async () => {
      expect(screen.getByText(/^Upload Image/)).toBeInTheDocument();
    })  

    expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument(); 

    const input = screen.getByTestId('input') as HTMLInputElement;

    userEvent.upload(input, fileGood);

    await waitFor(async () => {
      expect(input.files![0].name).toStrictEqual(fileGood.name);
    })  

    const submit = screen.getByTestId('uploadsubmit')
    expect(screen.getByTestId('uploadpreview')).toBeInTheDocument();
    expect(submit).toBeInTheDocument();

    // Change file input
    userEvent.upload(input, fileGood2);

    await waitFor(async () => {
      expect(input.files![0].name).toStrictEqual(fileGood2.name);
    })  
  })

  test("Should not allow uploads of files that are not an image and display proper error message", async () => {
    render({
      template:`
        <div>
          <HeaderTop />                
          <UploadModal />
        </div>
      `,
      components:{ HeaderTop, UploadModal }
    })

    const button = screen.getByRole("button");
    userEvent.click(button)

    await waitFor(async () => {
      expect(screen.getByText(/^Upload Image/)).toBeInTheDocument();
    })  

    expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument(); 
    expect(
      screen.queryByText("Selected file is not an image")
    ).not.toBeInTheDocument();

    const input = screen.getByTestId('input') as HTMLInputElement;

    // Choose file with wrong image type
    userEvent.upload(input, fileWrongType);

    await waitFor(async () => {
      expect(screen.queryByText('Selected file is not an image')).toBeInTheDocument();
    })  
  })

  test("Should not allow uploads of files that are too large and display proper error message", async () => {
    render({
      template:`
        <div>
          <HeaderTop />                
          <UploadModal />
        </div>
      `,
      components:{ HeaderTop, UploadModal }
    })

    const button = screen.getByRole("button");
    userEvent.click(button)

    await waitFor(async () => {
      expect(screen.getByText(/^Upload Image/)).toBeInTheDocument();
    })  

    expect(screen.queryByTestId('uploadpreview')).not.toBeInTheDocument();
    expect(screen.queryByTestId('uploadsubmit')).not.toBeInTheDocument(); 
    expect(screen.queryByText(`File size is too large. Maximum allowed size is 10 MB`)).not.toBeInTheDocument();

    const input = screen.getByTestId('input') as HTMLInputElement;

    // Make file size too large
    Object.defineProperty(fileGood, 'size', { value: MAX_FILE_SIZE_BYTES+1 })

    userEvent.upload(input, fileGood);

    await waitFor(async () => {
      expect(screen.queryByText(`File size is too large. Maximum allowed size is 10 MB`)).toBeInTheDocument();
    })  
  })
})