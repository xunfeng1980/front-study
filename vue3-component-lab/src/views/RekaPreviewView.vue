<script setup lang="ts">
import { ref } from 'vue'
import {
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarPortal,
  MenubarRoot,
  MenubarSeparator,
  MenubarTrigger,
  SelectContent,
  SelectItem,
  SelectItemText,
  SelectPortal,
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from 'reka-ui'
import SectionShell from '../components/SectionShell.vue'

const role = ref('engineering')
</script>

<template>
  <SectionShell
    title="Reka UI Preview"
    subtitle="这里放一个真实可运行的 Reka UI 示例，方便你在做练习前先对组件结构有感觉。"
  >
    <template #eyebrow>
      <span class="eyebrow">reka-ui</span>
    </template>

    <div class="preview-grid">
      <div class="preview-card">
        <h3>Select</h3>
        <SelectRoot v-model="role">
          <SelectTrigger class="reka-trigger" aria-label="Team role">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectPortal>
            <SelectContent class="reka-content" position="popper">
              <SelectViewport>
                <SelectItem class="reka-item" value="engineering">
                  <SelectItemText>Engineering</SelectItemText>
                </SelectItem>
                <SelectItem class="reka-item" value="design">
                  <SelectItemText>Design</SelectItemText>
                </SelectItem>
              </SelectViewport>
            </SelectContent>
          </SelectPortal>
        </SelectRoot>
      </div>

      <div class="preview-card">
        <h3>Menubar</h3>
        <MenubarRoot class="reka-menubar">
          <MenubarMenu>
            <MenubarTrigger class="reka-trigger">File</MenubarTrigger>
            <MenubarPortal>
              <MenubarContent class="reka-content">
                <MenubarItem class="reka-item">New Tab</MenubarItem>
                <MenubarSeparator class="reka-separator" />
                <MenubarItem class="reka-item">Open Project</MenubarItem>
              </MenubarContent>
            </MenubarPortal>
          </MenubarMenu>
        </MenubarRoot>
      </div>
    </div>
  </SectionShell>
</template>

<style scoped>
.eyebrow {
  display: inline-flex;
  padding: 0.28rem 0.6rem;
  border-radius: 999px;
  background: rgba(14, 116, 144, 0.12);
  color: #0f766e;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.preview-grid {
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(18rem, 1fr));
}

.preview-card {
  padding: 1rem;
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.82);
  border: 1px solid rgba(122, 97, 80, 0.12);
}

.preview-card h3 {
  margin-top: 0;
}

.reka-trigger {
  display: inline-flex;
  min-width: 12rem;
  align-items: center;
  justify-content: space-between;
  border-radius: 0.8rem;
  border: 1px solid rgba(148, 163, 184, 0.35);
  background: white;
  padding: 0.65rem 0.85rem;
  color: #0f172a;
}

.reka-content {
  min-width: 12rem;
  border-radius: 0.9rem;
  border: 1px solid rgba(148, 163, 184, 0.25);
  background: white;
  padding: 0.3rem;
  box-shadow: 0 18px 30px rgba(15, 23, 42, 0.12);
}

.reka-item {
  border-radius: 0.65rem;
  padding: 0.55rem 0.7rem;
  color: #0f172a;
}

.reka-item[data-highlighted] {
  background: #f1f5f9;
  outline: none;
}

.reka-separator {
  height: 1px;
  margin: 0.3rem 0;
  background: rgba(148, 163, 184, 0.25);
}

.reka-menubar {
  display: inline-flex;
}
</style>
