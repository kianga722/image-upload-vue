<script setup lang="ts">
  import { ref, onMounted, onUnmounted } from 'vue'
  import { MAX_THUMBNAIL_KEYS } from '../utils/CONSTANTS'

  import LoaderIcon from './LoaderIcon.vue'
  import ThumbNail from './ThumbNail.vue'

  const isLoading = ref(false)
  const thumbnails = ref<string[]>([])
  const isTruncated = ref(true)
  const continuationToken = ref<string | null>(null)

  let observer = ref<IntersectionObserver | null>(null)
  const observerTarget = ref(null)
  const loadMoreBtn = ref(null)

  async function getThumbnails() {
    if (!isTruncated.value) {
      return;
    }

    isLoading.value = true;

    try {
      let reqUrl = `${import.meta.env.VITE_BUCKET_URL_THUMBNAILS}?list-type=2&max-keys=${MAX_THUMBNAIL_KEYS}`;

      if (isTruncated.value && continuationToken.value !== null) {
        reqUrl += `&continuation-token=${continuationToken.value}`
      }

      const response = await fetch(reqUrl, {
        method: "GET"
      })

      const responseText = await response.text()

      const parser = new DOMParser();
      const docThumbnails = parser.parseFromString(responseText, "application/xml");

      // Check for truncation
      const docIsTruncated = docThumbnails.querySelector('IsTruncated');

      if (docIsTruncated?.textContent) {
        if (docIsTruncated.textContent === 'true') {
          isTruncated.value = true;
          // Check for continuation token
          const nextToken = docThumbnails.querySelector('NextContinuationToken');

          if (nextToken?.textContent) {
            continuationToken.value = encodeURIComponent(nextToken.textContent)
          }
        } else {
          isTruncated.value = false;
          continuationToken.value = null;
        }
      }

      // Get thumbnails
      const thumbs = docThumbnails.querySelectorAll('Key');

      const thumbsArr:string[] = [];
      for (let thumb of thumbs) {
        if (thumb.textContent) {
          thumbsArr.push(thumb.textContent)
        }
      }

      thumbnails.value = [
        ...thumbnails.value,
        ...thumbsArr
      ]

    } catch (err) {
      console.log('error', err)
    } finally {
      isLoading.value = false;
    }
  }

  function isElementInViewport(el: HTMLElement) {
    var rect = el.getBoundingClientRect();

    return rect.bottom > 0 &&
      rect.right > 0 &&
      rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */ &&
      rect.top < (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */;
  }

  // Get images on load
  getThumbnails()

  // Only trigger scroll after DOMContentLoaded and not currently loading anything
  onMounted(() => {
    observer.value = new IntersectionObserver(
      entries => {
        if (loadMoreBtn.value !== null 
          && !isElementInViewport(loadMoreBtn.value) 
          && entries[0].isIntersecting
          ) {
          if (!isLoading.value && document.readyState === 'complete') {
            getThumbnails()
          }
        }
      },
      { threshold: 1 }
    );

    if (observerTarget.value) {
      observer.value.observe(observerTarget.value);
    }
  })

  onUnmounted(() => {
    if (observer.value && observerTarget.value) {
      observer.value.unobserve(observerTarget.value);
    }
  })
</script>

<template>
  <section>
    <h2>Gallery</h2>

    <ul>
      <ThumbNail
        v-for="thumbnail in thumbnails"
        :key="thumbnail"
        :filename="thumbnail"
      />
    </ul>

    <template
      v-if="isLoading"
    >
      <LoaderIcon />
    </template>

    <div data-testid='observer-target' ref='observerTarget'></div>

    <template
      v-if="!isLoading && isTruncated"
    >
      <div className='button-wrapper'>
        <button 
          data-testid='load-more'
          className='load-more'
          @click="getThumbnails"
          ref="loadMoreBtn"
        >Load More</button>
      </div>
    </template>
  </section>
</template>


<style scoped>
section {
  margin: 0 auto;
  max-width: 1000px;
}

h2 {
  text-align: center;
}

ul {
  margin-top: 30px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-gap: 3px;
}
.button-wrapper {
  margin: 50px 0;
  display: flex;
  justify-content: center;
}
.load-more {
  padding: 5px 10px;

  border: 1px solid #000;
  border-radius: 4px;
  cursor: pointer;
}
</style>