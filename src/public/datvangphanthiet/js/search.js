
$(function () {
    var string = '';
    var stringAppend = function (id, sku, image, slug, name) {
        return `<li> <a href="/xe-dap/chi-tiet/${slug}.${id}" title="${name}">
            <div class="main"> 
                <div class="left-side">
                    <img src="/public/uploads/products/${image}"/> 
                </div>
                <div class="right-side">
                <p> ${name} </p> 
                   <span>  sku : ${sku}  </span>
                </div>
            </div>
        </a>
    </li>`;
    }
    var stringAppendAdvance = function (id, sku, price, image, slug, name) {
        return `
        <div class="col-sm-4 col-md-4 item">
            <div class="property-item">
              <div class="property-image bg-overlay-gradient-04">
                <img class="img-fluid" src="/public/uploads/products/${image}" alt="${name}">
                <div class="property-lable">
                  <span class="badge badge-md badge-primary"></span>
                  <span class="badge badge-md badge-info"> ${sku} </span>
                </div>
                <span class="property-trending" title="trending"><i class="fas fa-bolt"></i></span>
              </div>
              <div class="property-details">
                <div class="property-details-inner">
                  <h5 class="property-title"><a href="/san-pham/${slug}.${id}" title="${name}">${name}</a>
                  </h5>
                  <span class="property-address"><i class="fas fa-map-marker-alt fa-xs"></i>Virginia drive temple
                    hills</span>
                  <span class="property-agent-date"><i class="far fa-clock fa-md"></i>10 days ago</span>
                  <div class="property-price">${price}<span> vnđ</span></div>
                </div>
                <div class="property-btn">
                  <a class="property-link" href="/san-pham/${slug}.${id}" title="Xem chi tiết">Xem chi tiết</a>
                </div>
              </div>
            </div>
          </div>`;
    }
    function getSearchData(sku) {
        string = '';
        $.ajax({
            url: '/san-pham/search/' + sku,
            type: 'GET',
            success: function (result) {
                // cập nhật ngay lập tức avatar trên giao diện
                if (result.results.length > 0) {
                    for (var i = 0; i < result.results.length; i++) {
                        var image = {};
                        if (result.results[i].image.length > 0) {
                            image = JSON.parse(result.results[i].image);
                        } else {
                            image = '';
                        }
                        string += stringAppendAdvance(result.results[i].id, result.results[i].sku, result.results[i].price, image[0], result.results[i].slug, result.results[i].name)
                    }
                    $('#products_search').append(string);
                } else {
                    $('#products_search').append(`<li class="item">  <span> Không tìm thấy... </span></a>
                </li>`);
                }
            },
            error: function (error) {
                notify(error, 'danger');
                console.log(error);
            }
        })
    }
    $('#searchInput').on('keyup', function () {
        $('#products_search .item').remove();
        $('#products_search_main').hide();
        var search_value = $(this).val();
        if (search_value == '') {
            $('#products_search_main').show();
        } else {
            getSearchData(search_value);
            $('#products_search').show();
        }
    });
    // blog search start =================
    var stringBlogAppendAdvance = function (id, image, slug, title, short_description, time, author) {
        return `
        <div class="blog-post col-lg-6 mb-3">
            <div class="blog-post-image">
              <img class="img-fluid" src="/public/uploads/blogs/${image}" alt="${title}">
            </div>
            <div class="blog-post-content">
              <div class="blog-post-details">
                <div class="blog-post-title">
                  <h5><a class="line-clamp" href="/blog/${slug}.${id}"
                      title="${title}">${title}</a></h5>
                </div>
                <div class="blog-post-description">
                  <p class="mb-0 line-clamp">${short_description}</p>
                </div>
                <div class="blog-post-link mt-4">
                  <a class="btn btn-link p-0" href="/blog/${slug}.${id}" title="${title}">
                    Đọc thêm</a>
                </div>
              </div>
              <div class="blog-post-footer">
                <div class="blog-post-time">
                  <span> <i class="far fa-clock"></i>${time}</span>
                </div>
                <div class="blog-post-author">
                  <span> ${author}</span>
                </div>
              </div>
            </div>
          </div>`;
    }
    function getSearchBlogData(name) {
        string = '';
        $.ajax({
            url: '/blog/tim-kiem/' + name,
            type: 'GET',
            success: function (result) {
                // cập nhật ngay lập tức avatar trên giao diện
                if (result.results.length > 0) {
                    for (var i = 0; i < result.results.length; i++) {
                        string += stringBlogAppendAdvance(result.results[i].id,
                            result.results[i].image,
                            result.results[i].slug,
                            result.results[i].title,
                            result.results[i].short_description,
                            result.results[i].create_at,
                            result.results[i].author)
                    }
                    $('#blogs_search').append(string);
                } else {
                    $('#blogs_search').append(`<li class="blog-post"><span> Không tìm thấy... </span></a>
                </li>`);
                }
            },
            error: function (error) {
                notify(error, 'danger');
                console.log(error);
            }
        })
    }
    $('#searchBlogInput').on('keyup', function () {
        $('#blogs_search .blog-post').remove();
        $('#blogs_search_main').hide();
        var search_value = $(this).val();
        if (search_value == '') {
            $('#blogs_search_main').show();
        } else {
            getSearchBlogData(search_value);
            $('#blogs_search').show();
        }
    });
    // blog search start ===============
})
