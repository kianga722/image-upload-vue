import { MAX_THUMBNAIL_KEYS } from '../utils/CONSTANTS'

// import { mount } from "@vue/test-utils";
// Using @testing-library/vue instead of @vue/test-utils as the Mounting Library because test-utils returns a Wrapper which makes the IntersectionObserverMock not behave correctly (intersection) because it sets an HTMLElement instead in the observerMap
import { render, waitFor, screen, fireEvent } from '@testing-library/vue'
import { vi } from 'vitest'

import GalleryMain from '../components/GalleryMain.vue'
import ImageModal from '../components/ImageModal.vue'

import { server } from '../mocks/server.js'

beforeAll(() => server.listen())
// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('Testing Gallery', () => {
  // Have to mock both Intersection Observer and AWS S3 API
  const observerMap = new Map()
  const instanceMap = new Map()

  //@ts-ignore
  function intersect(element: Element, isIntersecting: boolean) {
    const cb = observerMap.get(element)
    if (cb) {
      cb([
        {
          isIntersecting,
          target: element,
          intersectionRatio: isIntersecting ? 1 : -1
        }
      ])
    }
  }

  // function getObserverOf(element: Element): IntersectionObserver {
  //     return instanceMap.get(element);
  // }

  beforeEach(() => {
    const IntersectionObserverMock = vi.fn((cb, options = {}) => {
      const instance = {
        thresholds: Array.isArray(options.threshold)
          ? options.threshold
          : [options.threshold],
        root: options.root,
        rootMargin: options.rootMargin,
        //@ts-ignore
        observe: vi.fn((element: Element) => {
          instanceMap.set(element, instance);
          observerMap.set(element, cb);
        }),
        //@ts-ignore
        unobserve: vi.fn((element: Element) => {
          instanceMap.delete(element);
          observerMap.delete(element);
        }),
        disconnect: vi.fn(),
      };
      return instance;
    })
  
    vi.stubGlobal('IntersectionObserver', IntersectionObserverMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    instanceMap.clear()
    observerMap.clear()
  })

  test('Should fetch data from AWS bucket and render Gallery', async () => {
    // const wrapper = mount(GalleryMain)

    // await vi.waitFor(() => {
    //   expect(wrapper.find('[data-testid="loader"]').exists()).toBe(false)
    // })

    // // console.log('wrapper', wrapper.html())

    // const imgs = wrapper.findAll('img')
    // expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS)

    render(GalleryMain)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    })

    // Wait for page to update with query text
    const imgs = await screen.findAllByRole('img');
    expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);
  })

  test("Should display more data when user scrolls down and hits the Intersection Observer Target", async () => {
    render(GalleryMain)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
    })

    const imgs = await screen.findAllByRole('img');
    expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS);
  
    const observerTarget = screen.getByTestId('observer-target');
    intersect(observerTarget, true);

    // console.log('screen', screen.debug())

    await waitFor(async () => {
      const imgsAfter = await screen.findAllByRole('img');
      expect(imgsAfter).toHaveLength(2*MAX_THUMBNAIL_KEYS);  
    })    
  })

  test('Should display more data when user hits the Load More Button', async () => {
    render(GalleryMain)

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    const imgs = await screen.findAllByRole('img')
    expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS)

    const button = screen.getByTestId('load-more')
    fireEvent.click(button)

    await waitFor(async () => {
      const imgsAfter = await screen.findAllByRole('img');
      expect(imgsAfter).toHaveLength(2*MAX_THUMBNAIL_KEYS); 
    })
  })

  test('Should render Image Modal with full image when thumbnail of same image is clicked', async () => {
    render({
      template:`
        <div>
          <GalleryMain />                
          <ImageModal />
        </div>
      `,
      components:{ GalleryMain, ImageModal }
    })

    await waitFor(() => {
      expect(screen.queryByTestId('loader')).not.toBeInTheDocument()
    })

    const imgs = await screen.findAllByRole('img')
    expect(imgs).toHaveLength(MAX_THUMBNAIL_KEYS)

    fireEvent.click(imgs[3])

    await waitFor(() => {
      expect(screen.queryByTestId('dialog-img')).toBeInTheDocument()
    })

    const clickedImgSrc = (imgs[3] as HTMLImageElement).src

    expect(clickedImgSrc).toContain('resized')

    const fullImageName = clickedImgSrc.replace('resized-', '').split('amazonaws.com')[1]

    const dialogImg: HTMLImageElement = await screen.findByTestId('dialog-img')
    const dialogImgName = dialogImg.src.split('amazonaws.com')[1]

    expect(dialogImgName).toBe(fullImageName)
  })
})
