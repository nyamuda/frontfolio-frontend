<template>
  <section class="bg-color d-flex justify-content-center align-items-center py-5">
    <div class="container">
      <div class="row justify-content-center">
        <div class="col-sm-10 col-md-8 col-lg-6 col-xl-5 text-center">
          <TitleSection title="How it works" align-items="center" />
          <p class="mb-4">
            Take your pick from the supply chain and participate in agribusiness projects that are
            backed up not only by Zou, but also by the best land, family heritage, innovation and
            overall superior expertise.
          </p>
        </div>
      </div>
      <div class="row justify-content-center">
        <!-- Stepper start -->
        <div class="col-md-10 col-lg-8">
          <Stepper value="1">
            <StepList>
              <Step value="1">Project Selection</Step>
              <Step value="2">Investment Process</Step>
              <Step value="3">Profit Distribution</Step>
            </StepList>
            <StepPanels>
              <StepPanel value="1">
                <div class="bg-color">
                  <div class="">
                    <div>
                      <h4 class="mb-3">Choose Your Project</h4>
                      <p class="mb-0">
                        Browse our curated selection of agribusiness opportunities. Each project
                        includes detailed information about land quality, expected yields, and
                        historical performance data.
                      </p>
                    </div>
                  </div>
                </div>
              </StepPanel>
              <StepPanel value="2">
                <div class="bg-color">
                  <div class="">
                    <div>
                      <h4 class="mb-3">Secure Your Investment</h4>
                      <p class="mb-0">
                        Complete our streamlined onboarding process. We handle all legal
                        documentation and provide transparent tracking of fund allocation and
                        project milestones.
                      </p>
                    </div>
                  </div>
                </div>
              </StepPanel>
              <StepPanel value="3">
                <div class="bg-color">
                  <div class="">
                    <div>
                      <h4 class="mb-3">Receive Returns</h4>
                      <p class="mb-0">
                        Earn quarterly dividends based on project performance. Our platform provides
                        detailed analytics showing exactly how your investment is performing.
                      </p>
                    </div>
                  </div>
                </div>
              </StepPanel>
            </StepPanels>
          </Stepper>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import TitleSection from "../shared/TitleSection.vue";
import Stepper from "primevue/stepper";
import StepList from "primevue/steplist";
import StepPanels from "primevue/steppanels";
import Step from "primevue/step";
import StepPanel from "primevue/steppanel";
</script>

<style lang="scss">
.bg-color {
  background-color: #fff2dc;
}
</style>
