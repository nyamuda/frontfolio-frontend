<template>
  <!-- Services -->
  <div id="services" class="cards-1">
    <div class="container">
      <div class="row">
        <div class="col-lg-12">
          <!-- Card -->
          <div class="card">
            <div class="card-icon blue">
              <span class="far fa-file-alt"></span>
            </div>
            <div class="card-body">
              <h5 class="card-title">Landing page</h5>
              <p>Lorem ipsum dolor sit amet, consect adipiscing elit nulla id nisl blah nor</p>
              <ul class="list-unstyled li-space-lg">
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Ut tincidunt vitae enim non vehi</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Phasellus vitae metus in felis</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Fusce pulvinar eu mi ac molestie</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Curabitur consequat nisl eget</div>
                </li>
              </ul>
            </div>
          </div>
          <!-- end of card -->

          <!-- Card -->
          <div class="card">
            <div class="card-icon yellow">
              <span class="fas fa-solar-panel"></span>
            </div>
            <div class="card-body">
              <h5 class="card-title">Corporate site</h5>
              <p>Nam eu erat tellused vivamus vitae sem in tortor pharetra vehicula orn</p>
              <ul class="list-unstyled li-space-lg">
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Vivaus dignissim sit amet nisi</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Aliqam a tristique nibh in pretium</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Nunc commodo magna quis blah</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Lacus fermentum tincidunt</div>
                </li>
              </ul>
            </div>
          </div>
          <!-- end of card -->

          <!-- Card -->
          <div class="card">
            <div class="card-icon red">
              <span class="fas fa-gift"></span>
            </div>
            <div class="card-body">
              <h5 class="card-title">Online shop</h5>
              <p>Nullam lobortis porta diam, vitae dictum metus placerat luctus bora</p>
              <ul class="list-unstyled li-space-lg">
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Sed laoreet blandit mollis ne</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Mauris non luctus est quisquerm</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Mattis dapibus quisque tristique</div>
                </li>
                <li class="d-flex">
                  <i class="fas fa-check"></i>
                  <div class="flex-grow-1">Cursus lacus interdum sollicdn</div>
                </li>
              </ul>
            </div>
          </div>
          <!-- end of card -->
        </div>
        <!-- end of col -->
      </div>
      <!-- end of row -->
    </div>
    <!-- end of container -->
  </div>
  <!-- end of cards-1 -->
  <!-- end of services -->
</template>

<style lang="scss">
.cards-1 {
  padding-top: 5rem;
  padding-bottom: 2.5rem;
}

.cards-1 .card {
  margin-bottom: 5rem;
  padding: 3rem 2rem;
  border: 1px solid #5e6576;
  border-radius: 20px;
  background-color: transparent;
}

.cards-1 .card-icon {
  width: 90px;
  height: 90px;
  margin-bottom: 1.875rem;
  text-align: center;
  background-size: 90px 90px;
}

.cards-1 .card-icon.blue {
  background: url("../images/services-icon-bg-blue.png") center center no-repeat;
}

.cards-1 .card-icon.yellow {
  background: url("../images/services-icon-bg-yellow.png") center center no-repeat;
}

.cards-1 .card-icon.red {
  background: url("../images/services-icon-bg-red.png") center center no-repeat;
}

.cards-1 .card-icon .fas,
.cards-1 .card-icon .far {
  margin-right: 0.75rem;
  color: #ffffff;
  font-size: 2rem;
  line-height: 98px;
}

.cards-1 .card-body {
  padding: 0;
}

.cards-1 .card-title {
  margin-bottom: 1.125rem;
}

.cards-1 .card-body p {
  margin-bottom: 1.125rem;
}

.cards-1 .list-unstyled {
  margin-bottom: 0;
}

.cards-1 .list-unstyled .fas {
  font-size: 0.875rem;
  line-height: 1.625rem;
}

.cards-1 .list-unstyled .flex-grow-1 {
  margin-left: 0.5rem;
}
</style>
